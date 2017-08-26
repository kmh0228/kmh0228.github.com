package IO;


import java.io.FileReader;
import java.io.IOException;

public class IO流展示 {


    public static void main(String[] args) throws IOException {//抛出IO异常



        //读数据和存数据
        //本来只有字节流，但编码表的出现，字节流+编码表编译，形成字符流

        //字节流两个顶层父类（基类）
        //InputStream,OutputStream,

        //字符流两个顶层父类
        //Writer,Reader
        //将文字存到电脑中 输出
        //如果操作文字数据优先考虑字符流，Writer
        //到API里找Writer子类
        //BufferedWriter, CharArrayWriter, FilterWriter, OutputStreamWriter, PipedWriter, PrintWriter, StringWriter
        //                                  写文件

        //需要先创建输出的文件对象


        //写入,如果文件不存在则创建，存在则覆盖
//        FileWriter fw=new FileWriter("demo8.txt");
//        fw.write("abcde");//写东西，但只是写到流里（缓冲区）;
//        fw.flush();//刷新缓冲流，把数据直接写到缓冲中
//
//        fw.write(LINE_SE+"123");//换行
//        fw.flush();
//
//        fw.close();//关闭此流,关闭时默认调用flush刷新缓冲
//        //此对象实际掉用的window资源，不close会一直调用
//
//        //续写,在构造函数加个true,在文件后面续写
//        FileWriter fw2=new FileWriter("demo.txt",true);
//        fw2.write("111"+LINE_SE);
//        fw2.flush();
//        fw2.close();


        //读数据,必须指明被读取文件
        FileReader fr=new FileReader("demo8.txt");
//        //用read方法读取字符
//        int ch=fr.read();//读取单个字符
//        System.out.println(ch);
//        int ch2=fr.read();//读取单个字符
//        System.out.println(ch2);
//        int ch3=fr.read();//读取单个字符
//        System.out.println(ch3);
//        //read是一个一个的读

        //读数组
        char[] arr=new char[4];
        int num=fr.read(arr);
        System.out.println(num+new String (arr));
        int num2=fr.read(arr);
        System.out.println(num2+new String (arr));
        int num3=fr.read(arr);
        System.out.println(num3+new String (arr));

        fr.close();


    }



}
