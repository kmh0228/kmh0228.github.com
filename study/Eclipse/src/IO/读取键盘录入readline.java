package IO;

import java.io.*;

public class 读取键盘录入readline {

    //所有的输入设备都有自己的对象


    public static void main(String[] args) throws IOException {
        //System.in是软件接受的数据
        InputStream in = System.in;//获取输入的对象
//        int ch = in.read();//这是个读数据的方法， 读不到，就一直等到有数据再执行
//        System.out.println(ch);
//        int ch2 = in.read();//这是个读数据的方法， 读不到，就一直等到有数据再执行
//        System.out.println(ch2);
//        int ch3 = in.read();//这是个读数据的方法， 读不到，就一直等到有数据再执行
//        System.out.println(ch3);
//        int ch4 = in.read();//这是个读数据的方法， 读不到，就一直等到有数据再执行
//        System.out.println(ch4);
//        //此流不用关，此流对象只有一个

        StringBuilder sb = new StringBuilder();

        //转换流对象,把字节流转换成字符流
        InputStreamReader ir= new InputStreamReader(in);
        //吧字符流转成字节流 OutputStreamWriter


        BufferedReader bf = new BufferedReader(ir);

        String line = null;


        //监控输入

                while((line=bf.readLine())!=null){
                    if("over".equals(line))
                    break;
                    System.out.println(line.toUpperCase());

                }


    }


}
