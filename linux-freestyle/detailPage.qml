import QtQuick 2.5
import QtQuick.Controls 2.0
import pizza.lug.classes 1.0

Item {
    id: distroDetailPageItem
    signal pageExit
    property string distroName: "arch"
    Image {
        x: 8
        y: 90
        width: 100
        height: 100
        source: "res/" + distroName + "/logo.png"
    }

    Text {
        //Description of the distro
        id: text1
        x: 139
        y: 86
        width: 237
        height: 139
        text: qsTr("a minimal distro, use it")
        font.pixelSize: 12
    }

    Button {
        id: installButton
        x: 417
        y: 86
        text: qsTr("Install")
        DDLauncher {
            id: ddcaller
        }
        onClicked: function() {
            //console.log("NOT IMPLEMENTED YET!!!")
            ddcaller.writeISO(distroName)
        }
    }

    Button {
        id: backButton
        x: 417
        y: 150
        text: qsTr("Back")
        onClicked: function() {
            distroDetailPageItem.pageExit()
        }
    }

}
