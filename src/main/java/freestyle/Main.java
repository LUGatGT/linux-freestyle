package freestyle;

import java.net.URL;
import javafx.application.Application;
import javafx.fxml.FXMLLoader;
import javafx.scene.Parent;
import javafx.scene.Scene;
import javafx.stage.Stage;


public class Main extends Application {

    @Override
    public final void start(Stage primaryStage) throws Exception {

        primaryStage.setTitle("Hello World");
        
        URL url = getClass().getResource("/FXMLDocument.fxml");
        System.out.println("URL is " + url);
        Parent root = FXMLLoader.load(url);
        Scene scene = new Scene(root);
        
        primaryStage.setScene(scene);

        //primaryStage.setFullScreen(true);
        primaryStage.setFullScreenExitHint("");
        primaryStage.show();
    }
}
