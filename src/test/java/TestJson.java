import freestyle.Distro;
import org.junit.Test;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;

import java.util.Map;
import java.lang.reflect.Type;

import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.BufferedReader;

public class TestJson {

    @Test
    public void isValidJson() {
        InputStream distroFileStream = getClass().getResourceAsStream("/distros.json");
        BufferedReader br = new BufferedReader(new InputStreamReader(distroFileStream));

        Type typeOfT = new TypeToken<Map<String, Distro>>() { } .getType();
        Gson gson = new Gson();

        Map<String, Distro> distros = gson.fromJson(br, typeOfT);
    }

}
