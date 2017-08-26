package gui;


import java.awt.*;
import java.awt.event.*;

public class 图形化界面 {
    public static void main(String[] args) {

        //GUI    图形化操作
        //CLI    DOS命令行操作
        //java 为此专门提供了两个包 awt  swing
        //awt 用的系统的图形
        //swing 基于awt 改善，图形不会根据系统而改变

        //建立窗体
        Frame f =new Frame("老子的超体");//建立不可见实例
//        f.setSize(500,400);//设置大小
//        f.setLocation(200,100);//设置初始位子
        f.setBounds(200,100,500,400);
        f.setLayout(new FlowLayout());//修改成流式布局
        f.setVisible(true);//设置成可见
        System.out.println("over");

        //建立Button
        Button b = new Button("怎么不是文字");

        f.add(b);
        //创建文本
        TextField tf = new TextField(15);
        f.add(tf);

        //事件监听机制
        f.addWindowListener(new WindowAdapter() {
            @Override
            public void windowClosing(WindowEvent e) {//系统关闭时间
                //super.windowClosing(e); e是时间对象
                System.out.println("close");
                System.exit(0);
            }
        });

        //按钮添加事件,活动监听
        b.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                System.out.println("鼠标活动");
                //System.exit(0);

            }
        });

        //给组件添加事件,在按钮上添加鼠标监听器
        b.addMouseListener(new MouseAdapter() {
            private int a=0;
            @Override
            public void mouseClicked(MouseEvent e) {
                super.mouseClicked(e);
                System.out.println("鼠标监听");
                //System.out.println(a++);
                tf.setText(""+a);

                if(e.getClickCount()==2){
                    System.out.println("你双击了");
                }

            }
       });

        tf.addKeyListener(new KeyAdapter() {
            @Override
            public void keyPressed(KeyEvent e) {
                super.keyPressed(e);
                //System.out.println("你按键盘了"+e.getKeyChar());
                System.out.println("你按键盘了"+KeyEvent.getKeyText(e.getKeyCode()));
            }
        });





    }
}
