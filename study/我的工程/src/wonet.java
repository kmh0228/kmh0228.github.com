



import java.io.IOException;
import java.net.*;





public class wonet {
    public static void main(String[] args) throws IOException {
        System.out.println("发送端启动。。。。");
        //java的net对象可以封装解析IP地址

        //建立iP主机对象
        InetAddress ip = InetAddress.getLocalHost();
        //获取主机地址和名称
        System.out.println(ip.getHostAddress());//获取地址
        System.out.println(ip.getHostName());

        //获取其他主机的ip主机对象
        InetAddress ip2 = InetAddress.getByName("www.jq22.com");
        System.out.println(ip2.getHostAddress());//获取地址
        System.out.println(ip2.getHostName());

        //socket//两个设备之间传输信息的东西。通讯的两端
        //网络编程，又称socket编程
        //UDP例子
        //建立udp传送端例子
            //建立udp socket服务
            DatagramSocket d = new DatagramSocket(8888);

            //将要发送的数据装到数据包中
            String str="假装这是赵明强传送的东西";
            byte[] bs=str.getBytes();
            //建立是数据包，含有内容地址端口
            DatagramPacket dp = new DatagramPacket(bs,bs.length,ip,8080);
            //发送
            d.send(dp);

            d.close();





    }
}
