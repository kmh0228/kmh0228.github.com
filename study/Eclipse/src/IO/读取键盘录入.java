package IO;

import java.io.IOException;
import java.io.InputStream;

public class 读取键盘录入 {

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

        //监控输入
        int ch=0;
        while ((ch=in.read())!=-1){

            if(ch=='\r')continue;

            if(ch=='\n'){

                String temp = sb.toString();

                if("over".equals(temp)){
                    break;
                }
                System.out.println(temp.toUpperCase());
                sb.delete(0,sb.length());
            }else{
                sb.append((char)ch);

            }

            //System.out.println(ch);
        }

    }


}
