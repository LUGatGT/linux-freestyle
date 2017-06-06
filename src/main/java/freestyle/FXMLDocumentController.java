package freestyle;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.lang.reflect.Type;
import java.net.URL;
import java.util.Map;
import java.util.ResourceBundle;
import javafx.fxml.FXML;
import javafx.fxml.Initializable;
import javafx.scene.Node;
import javafx.scene.image.Image;
import javafx.scene.image.ImageView;
import javafx.scene.layout.HBox;
import javafx.scene.layout.VBox;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;

public class FXMLDocumentController implements Initializable {

    @FXML
    private HBox hbox;

    @Override
    public void initialize(URL url, ResourceBundle rb) {
        Map<String, Distro> distros = getDistros();
        for (Node x : hbox.getChildren()) {
            VBox vbox = (VBox) x;
            for(String d : distros.keySet()) {
                ImageView iv = new ImageView();
                iv.setImage(new Image("images/" + d + ".png"));
                vbox.getChildren().add(iv);
            }
        }
    }

    public Map<String, Distro> getDistros()  {
        InputStream distroFileStream = getClass().getResourceAsStream("/distros.json");
        BufferedReader br = new BufferedReader(new InputStreamReader(distroFileStream));

        Type typeOfT = new TypeToken<Map<String, Distro>>() { } .getType();
        Gson gson = new Gson();

        return gson.fromJson(br, typeOfT);

    }
}
