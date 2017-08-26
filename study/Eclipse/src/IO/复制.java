package IO;


import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;

public class 复制 {
    public static void main(String[] args) throws IOException {

       //复制原理就是读+写//一个一个读

        FileReader fr = new FileReader("demo8.txt");


        FileWriter fw = new FileWriter("G:\\demo7.txt");

        int ch=0;
        while((ch=fr.read())!=-1){
            fw.write(ch);
        };

        fr.close();
        fw.close();


    }
}
