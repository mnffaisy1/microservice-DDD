const TYPES = {
  App: Symbol.for("App"),
  Logger: Symbol.for("Logger"),
  EventQueue: Symbol("EventsQueue"),
  UserRepository: Symbol("UserRepository"),
  DataSource: Symbol("DataSource"),
  MessagingProducer: Symbol("MessagingProducer")
};

export { TYPES };
