package IO;


import java.io.File;
import java.io.IOException;
import java.util.Date;


public class FileIo {



    public static void main(String[] args) throws IOException {
        File f = new File("G:"+File.separator+"demo8.txt");
        System.out.println(f);
        //File的方法
        //获取

        //获取名称
        String name = f.getName();
        System.out.println("name: "+name);

        //获取路径
        String path = f.getPath();//相对路径
        String path2 = f.getAbsolutePath();//绝对路径
        System.out.println("path: "+path);
        System.out.println("path2: "+path);

        //获取文件大小
        long len = f.length();
        System.out.println("大小: "+len);

        long time = f.lastModified();
        System.out.println("最后修改时间: "+new Date(time));

        //创建与删除，file创建于文件流输出不一样，如果有同名的文件则不再创建
        File b = new  File("G:\\test2");
        //b.createNewFile();//创建文件
        //System.out.println(b);//创建多级目录
        b.mkdir();//创建目录
        //b.mkdirs();
        //b.delete();//删除，慎用。直接拜拜，不去回收站
        //重命名
        File b2 = new File("G:\\test3");
        b.renameTo(b2);//同时可以实现剪切功能

        File c = new File("C:\\");

        String[] list = c.list();

        for(int i=0;i<list.length;i++){
            System.out.println(list[i]);
        }




    }
}
