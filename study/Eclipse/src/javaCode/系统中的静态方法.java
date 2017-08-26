package javaCode;

import java.io.IOException;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.Properties;
import java.util.Random;
import java.util.zip.DataFormatException;

public class 系统中的静态方法 {
    public static void sP(String a){
        System.out.println(a);
    }
    public static void sP(long a){
        System.out.println(a);
    }
    public static void main(String[] args) throws IOException, InterruptedException, ParseException {
        //System 这种类方法属性都是静态的

        //System.out 输出
        //System.in  输入
        sP(System.currentTimeMillis());//获取当前时间的毫秒值,以1970年1月1日0点起

        Properties p=System.getProperties();//获取系统属性信息，并存到Properties集合中，不带泛型
        //存的都是string的键和值,学完集合再了解一下

        //Runtime 单例模式，没有构造方法, 与系统关联
        Runtime r=Runtime.getRuntime();//获取对象
        //r.exec("用什么程序打开 打开的文件");
        //r.exec("calc.exe");//打开摸个程序
//        Process pr=r.exec("notepad.exe G:\\Eclipse\\demo8.txt");//打开摸个程序,返回进程
//        Thread.sleep(5000);
//        pr.destroy();//杀掉子继承,只能杀掉自己的继承

        //Math 跟Js的一样，

        double ra=Math.random();
        sP(""+ra);//第一种随机数

        Random ra2=new Random();
        sP(""+ra2.nextInt(5));//第二种随机数

        //Date类  import时要引入util里的date
        Date da=new Date(System.currentTimeMillis());//获取当前时间
        System.out.println(da);
        //DateFormat来玩日期格式                    格式风格
        DateFormat dm=DateFormat.getDateInstance(DateFormat.SHORT);//获取日期实例格式器
        String str_date=dm.format(da);
        System.out.println(str_date);


        //DateFormat dma=DateFormat.getInstance();
        DateFormat dma =new SimpleDateFormat("yy#MM#dd");//自定义格式

        String str_t=dma.format(da);
        System.out.println(str_t);

        //日期格式字符串转成日期对象
        String dateString = "2017-8-16";
        DateFormat dm2 = DateFormat.getDateInstance();
        Date date3 = dm2.parse(dateString);
        System.out.println(date3);


        //因为日期不过国际化被Calender取代
        Calendar ca = Calendar.getInstance();
        int year=ca.get(Calendar.YEAR);
        int week=ca.get(Calendar.DAY_OF_WEEK);
        System.out.println(year+" "+week);

        ca.set(2011,3,20);
        ca.add(Calendar.YEAR,1);//时间偏移

        System.out.println(ca);




    }
}
