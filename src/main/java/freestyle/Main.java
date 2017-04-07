package freestyle;

import javafx.application.Application;
import javafx.stage.Stage;


public class Main extends Application {

    @Override
    public final void start(Stage primaryStage) throws Exception {

        primaryStage.setTitle("Hello World");
        ScreenSaver screenSaver = new ScreenSaver();
        primaryStage.setScene(screenSaver.getScene());

        /*
        // How to use the fxml resources
        URL url = getClass().getResource("/FXMLDocument.fxml");
        System.out.println("URL is " + url);
        Parent root = FXMLLoader.load(url);
        Scene scene = new Scene(root);
        */

        primaryStage.setFullScreen(true);
        primaryStage.setFullScreenExitHint("");
        primaryStage.show();
    }
}
