import Time "mo:core/Time";
import Int "mo:core/Int";
import Array "mo:core/Array";
import Text "mo:core/Text";
import Order "mo:core/Order";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Map "mo:core/Map";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import Stripe "stripe/stripe";
import OutCall "http-outcalls/outcall";

actor {
  // Authorization
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // User Profiles
  public type UserProfile = {
    name : Text;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (not Principal.equal(caller, user) and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Stripe Integration
  var stripeConfig : ?Stripe.StripeConfiguration = null;

  public query func isStripeConfigured() : async Bool {
    stripeConfig != null;
  };

  public shared ({ caller }) func setStripeConfiguration(config : Stripe.StripeConfiguration) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can set Stripe configuration");
    };
    stripeConfig := ?config;
  };

  func getStripeConfiguration() : Stripe.StripeConfiguration {
    switch (stripeConfig) {
      case (null) { Runtime.trap("Stripe needs to be first configured") };
      case (?config) { config };
    };
  };

  public func getStripeSessionStatus(sessionId : Text) : async Stripe.StripeSessionStatus {
    await Stripe.getSessionStatus(getStripeConfiguration(), sessionId, transform);
  };

  public shared ({ caller }) func createCheckoutSession(
    items : [Stripe.ShoppingItem],
    successUrl : Text,
    cancelUrl : Text
  ) : async Text {
    await Stripe.createCheckoutSession(
      getStripeConfiguration(),
      caller,
      items,
      successUrl,
      cancelUrl,
      transform
    );
  };

  public query func transform(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    OutCall.transform(input);
  };

  // Application Data
  public type Application = {
    name : Text;
    email : Text;
    whatsapp : Text;
    position : Text;
    message : Text;
    paymentIntentId : Text;
    submittedAt : Int;
  };

  var applications : [Application] = [];

  func isDuplicate(email : Text, position : Text) : Bool {
    applications.find<Application>(
      func(app : Application) : Bool {
        app.email == email and app.position == position
      }
    ) != null;
  };

  public type CreatePaymentResult = {
    #ok : { clientSecret : Text };
    #invalidAmount;
    #paymentError : Text;
  };

  public type SubmitApplicationResult = {
    #ok;
    #paymentNotFound;
    #missingFields;
    #duplicateApplication;
    #submissionError : Text;
  };

  public shared ({ caller }) func createPaymentIntent(amount : Nat) : async CreatePaymentResult {
    // No authorization check
    if (amount != 2000) { return #invalidAmount };
    let dummyClientSecret = "dummy_client_secret_" # amount.toText();
    #ok { clientSecret = dummyClientSecret };
  };

  public shared ({ caller }) func submitApplication(
    name : Text,
    email : Text,
    whatsapp : Text,
    position : Text,
    message : Text,
    paymentIntentId : Text
  ) : async SubmitApplicationResult {
    if (name == "" or email == "" or whatsapp == "" or position == "" or paymentIntentId == "") {
      return #missingFields;
    };

    if (isDuplicate(email, position)) {
      return #duplicateApplication;
    };

    let newApplication : Application = {
      name;
      email;
      whatsapp;
      position;
      message;
      paymentIntentId;
      submittedAt = Time.now();
    };

    applications := applications.concat([newApplication]);
    #ok;
  };

  public query ({ caller }) func getApplications() : async [Application] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view applications");
    };

    // Sort by newest first (descending submittedAt)
    applications.sort<Application>(
      func(a : Application, b : Application) : Order.Order {
        Int.compare(b.submittedAt, a.submittedAt);
      }
    );
  };
};
