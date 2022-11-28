const TYPES = {
  App: Symbol.for("App"),
  Logger: Symbol.for("Logger"),
  EventQueue: Symbol("EventsQueue"),
  PostRepository: Symbol("PostRepository"),
  DataSource: Symbol("DataSource"),
  MessagingProducer: Symbol("MessagingProducer")
};

export { TYPES };
