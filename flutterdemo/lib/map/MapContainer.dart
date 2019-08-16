import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';
import 'package:fm_baidu_map/fm_baidu_map';

class MapContainer extends StatefulWidget{
  @override
    State<StatefulWidget> createState() {
      // TODO: implement createState
      return MapContainerState();
    }
}

class MapContainerState extends State<MapContainer>{
  //final fmBaiduMap _map = fmBaiduMap();
  @override
    Widget build(BuildContext context) {
      // TODO: implement build
      return Center(
        child: RaisedButton(
          onPressed: _launchURL,
          child: Text('Show Flutter homepage'),
        )
      );
    }
}

_launchURL() async {
	  const url = 'androidamap://keywordNavi?sourceApplication=softname&keyword=宛委山景区&style=2';
	  if (await canLaunch(url)) {
	    await launch(url);
	  } else {
	    throw 'Could not launch $url';
	  }
	}