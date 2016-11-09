#[macro_use]
extern crate qmlrs;

struct Logger;

impl Logger {
    fn info(&self, message: String) {
        println!("{}", message);
    }
}

Q_OBJECT! { Logger:
    slot fn info(String);
}

fn main() {
    let mut engine = qmlrs::Engine::new();

    engine.set_property("logger", Logger);
    engine.load_local_file("ui/main.qml");

    engine.exec();
}
