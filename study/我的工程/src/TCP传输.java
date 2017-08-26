import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.Socket;

public class TCP传输 {

    public static void main(String[] args) throws IOException {
        System.out.println("TCP发送端开启。。。。");
        //TCP传输方式不同,分为 客户端，服务端
        //Socket 创建未连接客户端,建议已创建就明确目的地

        Socket s = new Socket("localhost",8080);
        //链接目的地,建立socket流，输入输出都找socket
        OutputStream os = s.getOutputStream();

        os.write("我的信息".getBytes());


        //读取服务端返回的数据
        InputStream is = s.getInputStream();
        byte[] buf = new byte[1024];
        int len = is.read(buf);
        System.out.println(new String(buf,0,len));


        s.close();


    }


}
