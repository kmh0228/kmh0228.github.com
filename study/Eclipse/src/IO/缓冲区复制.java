package IO;

import java.io.*;

public class 缓冲区复制 {
    private static final int BUF_SIZ = 1024;//1024的整数倍

    //缓冲区的出现时为了增加写入效率的

    public static void main(String[] args) {
        //IO流 不关流的时候删除不掉

        char[] buf = new char[BUF_SIZ];
        FileReader fr = null;
        FileWriter fw = null;
        BufferedWriter buw=null;
        BufferedReader bur=null;
        try{
            fr = new FileReader("demo8.txt");
            bur =  new BufferedReader(fr);
            String line = "";

            fw = new FileWriter("G:\\demo6.txt");
            //建立写入的缓冲区
            buw =  new BufferedWriter(fw);


            while((line=bur.readLine())!=null){
                buw.write(line);
                buw.newLine();
                buw.flush();
            }



        }catch(Exception e){
            throw new RuntimeException("读写失败");
        }finally {
            if(bur!=null){
                try {
                    bur.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
            if(buw!=null){
                try {
                    buw.close();//缓冲区关掉，实际是把流关掉了
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }


        }

    }

}
