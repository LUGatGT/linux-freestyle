package freestyle;

import javafx.scene.image.Image;
import javafx.scene.image.ImageView;

public class TouchableImageView extends ImageView {

    public TouchableImageView(Image img) {
        super(img);

        setOnMousePressed(event -> {
            System.out.println("Mouse Pressed Event " + event);
            event.consume();
        });

        setOnMouseDragged(event -> {
            System.out.println("Mouse Dragged Event " + event);
            event.getX();
            event.getY();
            event.consume();
        });

        setOnMouseReleased(event -> {
            System.out.println("Mouse Released Event " + event);
            event.consume();
        });

    }
}
