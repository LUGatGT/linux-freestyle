import QtQuick 2.5
import QtQuick.Controls 1.4
import QtQuick.Dialogs 1.2
import QtQuick.Layouts 1.3
import pizza.lug.classes 1.0

ApplicationWindow {
    id: appWindow
    visible: true
    width: 800
    height: 480
    title: qsTr("Linux Freestyle")

    ListModel {
        id: distrosModel
        ListElement{ name: "arch"}
        ListElement{ name: "apricity"}
        ListElement{ name: "arch"}
        ListElement{ name: "archbang"}
        ListElement{ name: "centos"}
        ListElement{ name: "fedora"}
        ListElement{ name: "freebsd"}
        ListElement{ name: "gentoo"}
        ListElement{ name: "kali"}
        ListElement{ name: "kubuntu"}
        ListElement{ name: "manjaro"}
        ListElement{ name: "mint"}
        ListElement{ name: "netbsd"}
        ListElement{ name: "nixos"}
        ListElement{ name: "openbsd"}
        ListElement{ name: "opensuse"}
        ListElement{ name: "pclinuxos"}
        ListElement{ name: "puppy"}
        ListElement{ name: "rebeccablackos"}
        ListElement{ name: "redhat"}
        ListElement{ name: "slackware"}
        ListElement{ name: "tails"}
        ListElement{ name: "trisquel"}
        ListElement{ name: "ubuntu"}
    }


    PathView {
        id: pathView1
        anchors.rightMargin: -207
        anchors.bottomMargin: -59
        anchors.leftMargin: 207
        anchors.topMargin: 59
        anchors.fill: parent
        model: distrosModel
        delegate: distroDelegate
        path: Path {
            startX: -500; startY: 100
            PathLine {
                relativeX: 5000
                relativeY: 0
            }
        }
    }

    Loader {
        id: pageLoader
    }
    Connections {
        ignoreUnknownSignals: true
        target: pageLoader.item
        onPageExit : {
            pageLoader.source = "" //unload page
            pathView1.visible = true
        }
    }

    Component {
        id: distroDelegate
        ColumnLayout {
            MouseArea {
                onClicked: function() {
                    console.log(name)
                    //pageLoader.
                    pageLoader.setSource("detailPage.qml",{"distroName":name})
                    pathView1.visible = false
                }
                width: 100
                height: 100
                Image {
                    width: 100
                    height: 100
                    source: "res/" + name + "/logo.png"
                }
            }
        }
    }



}
