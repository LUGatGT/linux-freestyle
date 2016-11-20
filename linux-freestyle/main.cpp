#include <QApplication>
#include <QQmlApplicationEngine>
#include "ddlauncher.h"

int main(int argc, char *argv[])
{
    QApplication app(argc, argv);

    QQmlApplicationEngine engine;
    //expose our launcher class to QML
    qmlRegisterType<DDLauncher>("pizza.lug.classes",1,0,"DDLauncher");
    engine.load(QUrl(QStringLiteral("qrc:/main.qml")));

    return app.exec();
}
