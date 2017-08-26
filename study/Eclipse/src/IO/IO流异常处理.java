package IO;


import java.io.FileWriter;
import java.io.IOException;

public class IO流异常处理 {

   // private static final String LINE_SE=System.getProperty("line.separator");//系统的换行键

    public static void main(String[] args) {
//
//        FileWriter fw=new FileWriter("demo8.txt");
//        fw.write("abcde");//写东西，但只是写到流里（缓冲区）;
//        fw.flush();//刷新缓冲流，把数据直接写到缓冲中
//        fw.close();//关闭此流,关闭时默认调用flush刷新缓冲


        FileWriter fw=null;
        try{
            fw=new FileWriter("demo8.txt");
            fw.write("abcde");
        }catch (IOException e){
            System.out.println(e.toString());
        }finally{
            try {
                fw.close();
            }catch (IOException e){
                System.out.println(e.toString());
            }
        };

    }



}
