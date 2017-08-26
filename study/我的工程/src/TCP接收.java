import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.ServerSocket;
import java.net.Socket;

public class TCP接收 {

    public static void main(String[] args) throws IOException {
        System.out.println("TCP接收端开启。。。。。。");
        //建立TCP服务端
        //建立服务端socket
        ServerSocket ss = new ServerSocket(8080);

        //获取过来的Socket对象
        Socket s = ss.accept();//阻塞

        InputStream is = s.getInputStream();


        byte[] bf = new byte[1024];
        int len=is.read(bf);
        String text = new String(bf,0,len);
        System.out.println(text);

        System.out.println(s.getInetAddress());
        System.out.println(s.getPort());


        //给客户端返回数据
        OutputStream os = s.getOutputStream();
        os.write("收到".getBytes());



        //ss.close();
        s.close();



        //交互

    }


}
