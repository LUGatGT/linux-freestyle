package freestyle;

import java.net.URL;
import java.util.ResourceBundle;
import javafx.fxml.FXML;
import javafx.fxml.Initializable;
import javafx.scene.Node;
import javafx.scene.control.Label;
import javafx.scene.image.Image;
import javafx.scene.image.ImageView;
import javafx.scene.layout.HBox;
import javafx.scene.layout.VBox;

public class FXMLDocumentController implements Initializable {

    @FXML
    private HBox hbox;

    @Override
    public void initialize(URL url, ResourceBundle rb) {
        for (Node x : hbox.getChildren()) {
            VBox vbox = (VBox) x;
            for(int i = 0; i < 10; i++) {
                ImageView iv = new ImageView();
                iv.setImage(new Image("tux.png"));
                vbox.getChildren().add(iv);
            }
        }
    }
}
