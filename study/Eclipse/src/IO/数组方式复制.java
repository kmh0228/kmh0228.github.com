package IO;


import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;

public class 数组方式复制 {
    private static final int BUF_SIZ = 1024;//1024的整数倍

    public static void main(String[] args) {
        //IO流 不关流的时候删除不掉

        char[] buf = new char[BUF_SIZ];
        FileReader fr = null;
        FileWriter fw = null;
        try{
             fr = new FileReader("demo8.txt");
             fw = new FileWriter("G:\\demo6.txt");
             int len=0;
             while((len=fr.read(buf))!=-1){
                 fw.write(buf,0,len);
                 fw.flush();
             }
        }catch(Exception e){
            throw new RuntimeException("读写失败");
        }finally {
            if(fr!=null){
                try {
                    fr.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
            if(fw!=null){
                try {
                    fw.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }


        }

    }
}
