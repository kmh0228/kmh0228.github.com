package IO;

import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;

//尽量用字节流，字符流有可能出乱码
public class 字节流操作 {
    public static void main(String[] args) throws IOException {

        FileInputStream fi = new FileInputStream("demo8.txt");

        FileOutputStream fo = new FileOutputStream("G:\\demo8.txt");

//        //直接写到目的地，不用flush
//        fo.write("能写进去吗2".getBytes());
//        fo.close();//这个还是需要写的

        //文件

        //fi.available();//返回剩余的字节数//少用
        byte[] arr=new byte[fi.available()];
        fi.read(arr);
        fo.write(arr);

 }
}
