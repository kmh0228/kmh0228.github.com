package javaCode;



//StringBuffer 缓冲区，只是把数组封装了  长度可变，可存不同数据,
//最终要转成字符串进行使用
public class StringBuff {
    public static void main(String[] args) {

        StringBuffer s=new StringBuffer();//建立缓冲区
        s.append(0);//添加数据
        s.append(true);
        s.insert(1,"haha");
        //删除数据
        s.delete(1,2);//删除1到2的数据，包含1，不包含2
        s.deleteCharAt(2);//删除指定位子的数据
        //查找
        //charAt,indexOf,跟字符串方法一样
        //修改
        s.replace(1,2,"abc");//把1-2的干掉，换成abc
        s.setCharAt(1,'q');//只改变一个角标的


        System.out.println(s.length());
        System.out.println(s);
    }
}
