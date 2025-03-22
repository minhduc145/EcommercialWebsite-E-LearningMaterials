package mySpringBoot.sp1.Service.Custom;

import org.apache.commons.codec.binary.Hex;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

public class AuthServices {
    public static String HashPassword(String password) {
        try {
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            byte[] hashBytes = md.digest(password.getBytes());
            return Hex.encodeHexString(hashBytes);
        } catch (NoSuchAlgorithmException e) {
            return null;
        }
    }
}
