package com.rastreamentoapp;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.SQLException;

public class DatabaseModule extends ReactContextBaseJavaModule {
    private static final String DATABASE_URL = DatabaseConfig.DATABASE_URL;
    private static final String DATABASE_USER = DatabaseConfig.DATABASE_USER;
    private static final String DATABASE_PASSWORD = DatabaseConfig.DATABASE_PASSWORD;

    public DatabaseModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "DatabaseModule";
    }

    @ReactMethod
    public void registerUser(String name, String email, String password, String phone, String type, Promise promise) {
        try {
            // Conectar ao banco de dados
            Connection connection = DriverManager.getConnection(DATABASE_URL, DATABASE_USER, DATABASE_PASSWORD);

            // Preparar a query de inserção
            String sql = "INSERT INTO " + type + "s (name, email, password, phone) VALUES (?, ?, ?, ?)";
            PreparedStatement statement = connection.prepareStatement(sql);
            
            // Setar os valores
            statement.setString(1, name);
            statement.setString(2, email);
            statement.setString(3, password);
            statement.setString(4, phone);

            // Executar a query
            int rowsAffected = statement.executeUpdate();

            // Fechar conexões
            statement.close();
            connection.close();

            // Retornar sucesso
            WritableMap result = Arguments.createMap();
            result.putBoolean("success", true);
            result.putString("userType", type);
            promise.resolve(result);

        } catch (SQLException e) {
            promise.reject("DATABASE_ERROR", "Erro ao registrar usuário: " + e.getMessage());
        }
    }
}
