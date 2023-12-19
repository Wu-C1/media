package com.rubin.rpan.storage.local.util;

import com.microsoft.azure.storage.CloudStorageAccount;
import com.microsoft.azure.storage.StorageException;
import com.microsoft.azure.storage.blob.CloudBlobClient;
import com.microsoft.azure.storage.blob.CloudBlobContainer;
import com.microsoft.azure.storage.blob.CloudBlockBlob;
import com.microsoft.azure.storage.blob.ListBlobItem;

import java.io.File;
import java.io.IOException;
import java.net.URISyntaxException;
import java.security.InvalidKeyException;
import java.text.MessageFormat;


/**
 * Azure blob
 * @author
 * @version 1.0
 * @date 2020-07-14 16:16
 */
public class AzureBlob {
    private static String ACCOUNT_NAME = "media2blob";
    private static String ACCOUNT_KEY = "";
    private static String END_POINT = "core.windows.net";
    private static String PROTOCOL = "https";
    private static String format = "DefaultEndpointsProtocol={0};AccountName={1};AccountKey={2};EndpointSuffix={3}";

    private static String serverUrl = "https://media2blob.blob.core.windows.net/media2blob";
    private static CloudStorageAccount storageAccount = null;
    private static CloudBlobClient blobClient = null;
    private static CloudBlobContainer container = null;



    static {
        initAzure("media2blob");
    }


    public static String uploadFile(File file,String visitUrl) {
        try {
            CloudBlockBlob blob = container.getBlockBlobReference(visitUrl.substring(1,visitUrl.length()));
            // Upload local files to Azure Container
            blob.uploadFromFile(file.getPath());
            // Obtain attribute acquisition
            blob.downloadAttributes();
            // Obtain the file size after uploading
            long blobSize = blob.getProperties().getLength();
            // Obtain local file size
            long localSize = file.length();
            // check
            if (blobSize != localSize) {
                System.out.println("Upload failure");
                // Delete blob
                blob.deleteIfExists();
            } else {
                System.out.println("Upload successful");
            }
        } catch (URISyntaxException | StorageException | IOException e) {
            e.printStackTrace();
        }
        //https://media2blob.blob.core.windows.net/media2blob/data/pan/2023/12/19/BE776E2B7DD74B5783C919397F28BFA8.mp4
        return serverUrl + visitUrl;
    }


    public static void initAzure(String containerName) {
        try {
            storageAccount = CloudStorageAccount.parse(MessageFormat.format(format, PROTOCOL, ACCOUNT_NAME, ACCOUNT_KEY, END_POINT));
            blobClient = storageAccount.createCloudBlobClient();
            container = blobClient.getContainerReference(containerName);
        } catch (URISyntaxException | InvalidKeyException | StorageException e) {
            e.printStackTrace();
        }
    }
}


