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

    Component {
        id: distroDelegate

        ColumnLayout {

            MouseArea {
                width: 100
                height: 100
                onClicked: function() {
                    console.log("Clicked on distro: ", name);
                }
                Image {
                    source: "/res/" + name + "/logo.png"
                }
            }
        }
    }

    ListModel {
        id: categories
        ListElement {
            label: "By Flavor"
            tag: "flavor"
        }
        ListElement {
            label: "By Name"
            tag: "all"
        }
        ListElement {
            label: "By Desktop"
            tag: "desktop"
        }
        ListElement {
            label: "By Specialty"
            tag: "special"
        }
        ListElement {
            label: "Esoteric"
            tag: "esoteric"
        }
    }
    
    ColumnLayout {
        x: 0
        y: 0
        width: parent.width
        height: parent.height
        
        RowLayout {
            id: top_menu_bar
            width: parent.width
            Layout.fillWidth: true
            anchors.top: parent.top

            TopMenuButton {
                id: top_back_btn
                text: "Go Back"
            }
            
            // top menu
            ListView {
                id: top_menu_btns
                Layout.fillWidth: true
                orientation: ListView.Horizontal
                model: categories
                anchors.left: up_level_btn.right
                anchors.right: parent.right
                anchors.top: parent.top

                delegate: TopMenuButton {
                    text: label
                }
            }
        }
        
        // main selection circles
        GridView {
            id: main_selection_menu
            z: -1
            Layout.fillWidth: true
            anchors.top: top_menu_bar.bottom
            anchors.left: parent.left
            anchors.right: parent.right
            anchors.bottom: parent.bottom
            cellWidth: 150
            cellHeight: 150
            model: distrosModel
            delegate: distroDelegate
        }
    }
}
