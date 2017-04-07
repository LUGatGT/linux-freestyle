package freestyle;

import javafx.geometry.Insets;
import javafx.scene.Scene;
import javafx.scene.control.Label;
import javafx.scene.image.Image;
import javafx.scene.layout.BorderPane;
import javafx.scene.layout.HBox;

public class ScreenSaver {
    private Scene scene;

    public ScreenSaver() {
        BorderPane borderPane = new BorderPane();
        final int topPadding = 50;
        final int leftPadding = 100;
        final int bottomPadding = 50;
        final int rightPadding = 100;
        borderPane.setPadding(new Insets(topPadding, leftPadding,
                    bottomPadding, rightPadding));
        scene = new Scene(borderPane);

        String tuxFile = getClass().getResource("/tux.png").toExternalForm();
        Image img = new Image(tuxFile);
        TouchableImageView iv = new TouchableImageView(img);

        Label l1 = new Label("Pick a Distro");
        Label l2 = new Label("Insert flash drive");
        Label l3 = new Label("Flash Image");
        final int horizontalPadding = 20;
        HBox hb = new HBox(horizontalPadding);
        hb.getChildren().addAll(l1, l2, l3, iv);

        borderPane.setCenter(hb);

    }

    public Scene getScene() {
        return scene;
    }
}

