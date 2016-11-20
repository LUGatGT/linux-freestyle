#include "ddlauncher.h"
#include <iostream>

DDLauncher::DDLauncher(QObject *parent) : QObject(parent)
{

}

void DDLauncher::writeISO(const QString &distro) {
    m_process = new QProcess(this);

    //This is assuming the ISO file is stored with the images
    //We can change this later
    QString iso_path = "res/"+distro+"/"+distro+".iso";

    //Get back the mount path/location of the usb we have inserted
    QString usb_path = getUSBPath();

    //ddd script has usage currently as:
    //ddd start [infile] [outfile]
    QString ddd_command = "ddd start "+iso_path+" "+usb_path;

    //Doesn't support multithreaded calls yet. May block UI thread.
    //uncomment when ready
    std::cout << "Running " << ddd_command.toStdString() << "\n";
    //m_process->start(ddd_command);
    //m_process->waitForFinished(-1);
    delete m_process;

    //standard error to force cout messages to appear before program closes
    std::cerr << "Finished writing...\n";
    return;
}

QString DDLauncher::getUSBPath() {
    //TODO need to get this information from UDEV somehow???
    QString ret = "/tmp";
    std::cout << "HAVEN'T IMPLEMENTED GETTING USB LOCATION YET!\n";
    return ret;
}
