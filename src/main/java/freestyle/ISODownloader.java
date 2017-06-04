package freestyle;

//import com.google.gson.Gson;

public class ISODownloader {

    private ISODownloader() {
    }

    public void parseISOData() {
        String distroFile = getClass().getResource("/distros.json").
            toExternalForm();
    }
}
