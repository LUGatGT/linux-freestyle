import org.junit.Test;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;
import static org.junit.Assert.assertEquals;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;

import java.util.HashMap;
import java.util.Map;
import java.lang.reflect.Type;

public class TestJson {

    @Test
    public void isValidJson() {
        String distroFile = getClass().getResource("/distros.json").
            toExternalForm();

        Type typeOfT = new TypeToken<Map<String,Distro>>(){}.getType();
        Gson gson = new Gson();

        Map<String,Distro> distros = gson.fromJson(distroFile, typeOfT);
        System.out.println(distros);
    }

    @Test
    public void createJson() {
        Gson gson = new Gson();
        Distro d = new Distro();
        d.name = "Ubuntu";
        d.version = "12.04";
        d.iso = "http://google.com/index.iso";
        d.logo_url = "http://google.com/index.iso";

        String s = gson.toJson(d);
        System.out.println(s);
    }
}
