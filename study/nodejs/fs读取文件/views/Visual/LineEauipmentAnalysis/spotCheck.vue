<template>
  <el-row :id="id" class="spotCheck">
        <el-col class="spotCheck-num">
          <ul>
            <li>
              <p>已达成数量</p>
              <p style="color:red">未达成数量</p>
              <p>点检达成率</p>
            </li>
            <li class="num-border">
              <p>{{complete}} </p>
              <p style="color:red">{{incomplete}}</p>
              <p>{{rate}}</p>
            </li>
          </ul>
        </el-col>
  </el-row>
</template>

<script>
export default {
  data () {
    return {

    }
  },
  props: {
    id: String,
    complete: Number,
    incomplete: Number
  },
  computed: {
    rate () {
      if ((this.complete + this.incomplete) > 0) {
        return (this.complete / (this.complete + this.incomplete) * 100).toFixed(2) + '%'
      } else {
        return '0%'
      }
    }
  }

}
</script>
<style lang="scss" scoped>
.spotCheck {
  height: 100%;
  width: 100%;
  .spotCheck-num {
    height: 35%;
    ul {
      display: flex;
      margin-top: 5vh;
      li {
        flex: 1;
        p {
          font-size: 1.3vw;
          color: #40fff9;
          line-height: 3vh;
          text-align: center;
          margin-bottom: 3vh;
        }
        .num-normal {
          font-size: 2.5vw;
          margin-top: 3vh;
          color: #40fff9;
        }
      }
      .num-border {
        border-left: 1px solid #000;
      }
    }
  }
}
</style>
