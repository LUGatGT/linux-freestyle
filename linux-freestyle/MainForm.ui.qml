import QtQuick 2.5
import QtQuick.Controls 1.4
import QtQuick.Layouts 1.2

Item {
    width: 640
    height: 480


    RowLayout {
        width: 640
        height: 480
        anchors.centerIn: parent

        Button {
            id: button1
            text: qsTr("Back")
        }

        GridLayout {
            id: gridLayout1
            width: 611
            height: 378
            Layout.preferredWidth: -1
            Layout.fillWidth: true
            Layout.alignment: Qt.AlignHCenter | Qt.AlignVCenter
            columns: 3
            columnSpacing: 100
            rowSpacing: 100
            rows: 2

            Image {
                id: image1
                width: 100
                height: 100
                sourceSize.height: 100
                sourceSize.width: 100
                source: "res/ubuntu/logo.png"
            }

            Image {
                id: image2
                width: 100
                height: 100
                sourceSize.width: 100
                sourceSize.height: 100
                source: "res/tails/logo.png"
            }

            Image {
                id: image3
                width: 100
                height: 100
                sourceSize.width: 100
                sourceSize.height: 100
                source: "res/freebsd/logo.png"
            }

            Image {
                id: image4
                width: 100
                height: 100
                sourceSize.width: 100
                sourceSize.height: 100
                source: "res/nixos/logo.png"
            }

            Image {
                id: image5
                width: 100
                height: 100
                sourceSize.width: 100
                sourceSize.height: 100
                source: "res/kubuntu/logo.png"
            }

            Image {
                id: image6
                width: 100
                height: 100
                sourceSize.width: 100
                sourceSize.height: 100
                source: "res/gentoo/logo.png"
            }
        }

        Button {
            id: button2
            text: qsTr("Forward")
            enabled: true
        }
    }
}
