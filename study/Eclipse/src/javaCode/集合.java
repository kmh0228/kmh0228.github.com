package javaCode;

//多个对象，且个数不确定。用集合。集合长度可变。不能存基本类型值

//使用 Collection 接口
//通常使用只是使用下面的一个类。

import java.util.ArrayList;
import java.util.Collection;
import java.util.Iterator;
import java.util.Map;



public class 集合 {
    public static void main(String[] args) {
        ArrayList c=new ArrayList();

        c.add("abc");//add 添加
        c.add("abc2");//add 添加
        c.add("abc3");//add 添加
        //c.remove("abc2");
        //c.addAll("ccc");// 把另一个集合的数据全部加到这里
        //c.size();//获取集合长度
        //c.iterator();//选取元素。返回迭代器对象
        Iterator it=c.iterator();

        while(it.hasNext()){

            System.out.println(it.next());

        }

        //....看API,还有map

    }
}
