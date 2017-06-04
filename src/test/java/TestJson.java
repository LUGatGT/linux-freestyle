import freestyle.Distro;
import org.junit.Test;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;
import static org.junit.Assert.assertEquals;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;

import java.util.HashMap;
import java.util.Map;
import java.lang.reflect.Type;

import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.BufferedReader;

import java.io.IOException;

public class TestJson {

    @Test
    public void isValidJson() throws IOException {
        InputStream distroFileStream = getClass().getResourceAsStream("/distros.json");
        BufferedReader br = new BufferedReader(new InputStreamReader(distroFileStream));

        Type typeOfT = new TypeToken<Map<String,Distro>>(){}.getType();
        Gson gson = new Gson();

        Map<String,Distro> distros = gson.fromJson(br, typeOfT);
    }

}
