import QtQuick 2.5
import QtQuick.Controls 1.4
import QtQuick.Dialogs 1.2
import QtQuick.Layouts 1.3

ApplicationWindow {
    id: appWindow
    visible: true
    width: 800
    height: 480
    title: qsTr("Linux Freestyle")

    ListModel {
        id: distrosModel
        ListElement{ name: "apricity" }
        ListElement{ name: "arch" }
        ListElement{ name: "archbang" }
        ListElement{ name: "centos" }
        ListElement{ name: "fedora" }
        ListElement{ name: "freebsd" }
        ListElement{ name: "gentoo" }
        ListElement{ name: "kali" }
        ListElement{ name: "kubuntu" }
        ListElement{ name: "manjaro" }
        ListElement{ name: "mint" }
        ListElement{ name: "netbsd" }
        ListElement{ name: "nixos" }
        ListElement{ name: "openbsd" }
        ListElement{ name: "opensuse" }
        ListElement{ name: "pclinuxos" }
        ListElement{ name: "puppy" }
        ListElement{ name: "rebeccablackos" }
        ListElement{ name: "redhat" }
        ListElement{ name: "slackware" }
        ListElement{ name: "tails" }
        ListElement{ name: "trisquel" }
        ListElement{ name: "ubuntu" }
    }


    GridView {
        id: pathView1
        width: 800
        height: 480
        model: distrosModel
        delegate: distroDelegate
        cellWidth: 200
        cellHeight: 200
    }


    // PathView {
    //     id: pathView1
    //     anchors.rightMargin: -207
    //     anchors.bottomMargin: -59
    //     anchors.leftMargin: 207
    //     anchors.topMargin: 59
    //     anchors.fill: parent
    //     model: distrosModel
    //     delegate: distroDelegate
    //     path: Path {
    //         startX: -500; startY: 100
    //         PathLine {
    //             relativeX: 5000
    //             relativeY: 0
    //         }
    //     }
    // }


    Component {
        id: distroDelegate
        ColumnLayout {
            anchors.leftMargin: 200
            MouseArea {
                width: 100
                height: 100
                onClicked: function() {
                    logger.info(name);
                }
                Image {
                    source: "../res/" + name + "/logo.png"
                }
            }
        }
    }
}
