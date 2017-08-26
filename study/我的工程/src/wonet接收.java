import java.io.IOException;
import java.net.DatagramPacket;
import java.net.DatagramSocket;
import java.net.SocketException;

public class wonet接收 {
    public static void main(String[] args) throws IOException {
        //接受端
        System.out.println("接收端启动.。。。。。。。");
        //建立socket服务
        //不明确端口号则随机
        DatagramSocket d = new DatagramSocket(8080);

        //建立接受数据的数组
        byte[] b = new byte[1024];
        //建立接受包
        DatagramPacket dp = new DatagramPacket(b,b.length);

        //接受数据
        d.receive(dp);//阻塞式方法

        //数据处理
        System.out.println(dp.getAddress());
        System.out.println(dp.getPort());
        System.out.println(new String(dp.getData(),0,dp.getLength()));

        d.close();


        //可以用while循环持续接收

    }
}
