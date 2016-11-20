#ifndef DDLAUNCHER_H
#define DDLAUNCHER_H

#include <QObject>
#include <QProcess>
#include <QString>

class DDLauncher : public QObject
{
    Q_OBJECT
public:
    explicit DDLauncher(QObject *parent = 0);
    Q_INVOKABLE void writeISO(const QString &distro);
    QString getUSBPath();
private:
    QProcess * m_process;
signals:

public slots:
};

#endif // DDLAUNCHER_H
