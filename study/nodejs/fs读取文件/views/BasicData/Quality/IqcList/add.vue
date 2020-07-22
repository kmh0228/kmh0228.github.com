<template>
  <div class="mes-main mes-work-order mes-handle">
     <div class="mes-main-header_bg" style="color:#3B6F9A"></div>
       <div class="mes-handle-content">
      <el-row :gutter="15">
        <el-col :span="24">
          <el-button type="primary" plain size="mini" @click="saveWorkOrder">保存</el-button>
          <el-button type="primary" plain size="mini" @click="closeCurrentPage">关闭</el-button>
        </el-col>
      </el-row>
      <div class="mes-main-tabs" style="margin-top:10px;">
         <el-tabs v-model="activeName" >
            <el-tab-pane label="基本资料" name="infoTab">
              <el-form v-model="infoData"  label-width="90px" label-position="left" class="el-row mes-form-rule"  >
                <el-form-item label="料号" class="el-col el-col-7">
                  <el-input size="mini" ></el-input>
                </el-form-item>
                  <el-form-item label="供应商料号" class="el-col el-col-7 el-col-offset-1">
                  <el-input size="mini" ></el-input>
                </el-form-item>
                  <el-form-item label="数量" class="el-col el-col-7 el-col-offset-1">
                  <el-input size="mini" ></el-input>
                </el-form-item>
                  <el-form-item label="仓码" class="el-col el-col-7">
                  <el-input size="mini" ></el-input>
                </el-form-item>
                  <el-form-item label="物料类别" class="el-col el-col-7 el-col-offset-1">
                  <el-input size="mini" ></el-input>
                </el-form-item>
                  <el-form-item label="品名" class="el-col el-col-7 el-col-offset-1">
                  <el-input size="mini" ></el-input>
                </el-form-item>
                  <el-form-item label="入库单号" class="el-col el-col-7">
                  <el-input size="mini" ></el-input>
                </el-form-item>
                  <el-form-item label="供应商名称" class="el-col el-col-7 el-col-offset-1">
                  <el-input size="mini" ></el-input>
                </el-form-item>
                  <el-form-item label="供应商代码" class="el-col el-col-7 el-col-offset-1">
                  <el-input size="mini" ></el-input>
                </el-form-item>
                  <el-form-item label="采购单号" class="el-col el-col-7">
                  <el-input size="mini" ></el-input>
                </el-form-item>
                  <el-form-item label="检规编号" class="el-col el-col-7 el-col-offset-1">
                  <el-input size="mini" ></el-input>
                </el-form-item>
                  <el-form-item label="检规版次" class="el-col el-col-7 el-col-offset-1">
                  <el-input size="mini" ></el-input>
                </el-form-item>
                  <el-form-item label="检验日期" class="el-col el-col-7">
                  <el-input size="mini" ></el-input>
                </el-form-item>
                  <el-form-item label="批号" class="el-col el-col-7 el-col-offset-1">
                  <el-input size="mini" ></el-input>
                </el-form-item>
              </el-form>
            </el-tab-pane>
            <el-tab-pane  label="抽样设置" name="sampling">
              <el-radio v-model="radio" label="1">抽样</el-radio>
              <el-radio v-model="radio" label="2">免检</el-radio>
              <div v-show="showRadio" style="margin-top:1.5vh">
                <el-radio v-model="radioChildren" label="1-1">ANSI/ASQ Z1.4 2008 —— 一般</el-radio>
                <el-radio v-model="radioChildren" label="1-2">ANSI/ASQ Z1.4 2008 —— 一般</el-radio>
                <el-radio v-model="radioChildren" label="1-3">c=0</el-radio>
              </div>
              <el-form :model="radioForm"  label-width="90px" label-position="left" class="el-row mes-form-rule" v-if="AqlShow" style="margin-top:1.5vh">
                <el-form-item label="AQL" class="el-col el-col-5">
                  <el-select>
                    <el-option></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="抽样数" class="el-col el-col-5 el-col-offset-1">
                  <el-input size="mini" > </el-input>
                </el-form-item>
                  <el-form-item label="不良数" class="el-col el-col-5 el-col-offset-1">
                  <el-input size="mini" > </el-input>
                </el-form-item>
                  <el-form-item label="不良率" class="el-col el-col-5 el-col-offset-1">
                  <el-input size="mini" > </el-input>
                </el-form-item>
              </el-form>
               <el-form :model="radioFormStrict"  label-width="90px" label-position="left" class="el-row mes-form-rule" v-if="AqlShowStrict" style="margin-top:1.5vh">
                <el-form-item label="AQL" class="el-col el-col-5">
                  <el-select>
                    <el-option></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="抽样数" class="el-col el-col-5 el-col-offset-1">
                  <el-input size="mini" > </el-input>
                </el-form-item>
                  <el-form-item label="不良数" class="el-col el-col-5 el-col-offset-1">
                  <el-input size="mini" > </el-input>
                </el-form-item>
                  <el-form-item label="不良率" class="el-col el-col-5 el-col-offset-1">
                  <el-input size="mini" > </el-input>
                </el-form-item>
              </el-form>
              <el-form :model="radioFormC"  label-width="80px" label-position="left" class="el-row mes-form-rule" v-if="CAqlShow" style="margin-top:1.5vh">
                <el-form-item label="抽样计划" class="el-col el-col-4">
                  <el-select>
                    <el-option></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="AQL" class="el-col el-col-4 el-col-offset-1">
                  <el-select>
                    <el-option></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="抽样数" class="el-col el-col-4 el-col-offset-1">
                  <el-input size="mini" > </el-input>
                </el-form-item>
                  <el-form-item label="不良数" class="el-col el-col-4 el-col-offset-1">
                  <el-input size="mini" > </el-input>
                </el-form-item>
                  <el-form-item label="不良率" class="el-col el-col-4 el-col-offset-1">
                  <el-input size="mini" > </el-input>
                </el-form-item>
              </el-form>
            </el-tab-pane>
            <el-tab-pane label="检验记录" name='record'>
              <el-table :data="checkData" border>
                <el-table-column type="index" label="项次" align="center"></el-table-column>
                <el-table-column label="检验项目" align="center" ></el-table-column>
                <el-table-column label="检验内容" align="center"></el-table-column>
                <el-table-column label="规格" align="center"></el-table-column>
                <el-table-column label="抽样数" align="center"></el-table-column>
                <el-table-column label="单位" align="center"></el-table-column>
                <el-table-column label="检测工具" align="center"></el-table-column>
                <el-table-column label="检测结果" align="center"></el-table-column>
              </el-table>
            </el-tab-pane>
            <el-tab-pane label="不良类别" name="category">
                <el-button>新增</el-button>
                <el-table :data="harmData" border style="margin-top:1.5vh">
                  <el-table-column type="index" label="项次" align="center"></el-table-column>
                  <el-table-column label="不良名称" align="center"></el-table-column>
                  <el-table-column label="备注" align="center"></el-table-column>
                  <el-table-column label="数量" align="center"></el-table-column>
                  <el-table-column label="操作" align="center">
                    <el-button type="danger" icon="el-icon-delete" size="mini" ></el-button>
                  </el-table-column>
                </el-table>
            </el-tab-pane>
             <el-tab-pane label="判定" name="determine">
              <el-radio v-model="decide" label="1">合格</el-radio>
              <el-radio v-model="decide" label="2">拒收</el-radio>
              <el-radio v-model="decide" label="3">特采</el-radio>
              <el-radio v-model="decide" label="4">挑选</el-radio>
              <el-form :model="decideForm"   label-width="180px" label-position="left" class="el-row mes-form-rule" v-if="isdecide" style="padding-top:1.5vh">
                <el-form-item label="特采单号" class="el-col el-col-11">
                  <el-input></el-input>
                </el-form-item>
                <el-form-item label="供应商异常联络单" class="el-col el-col-11 el-col-offset-1">
                  <el-input></el-input>
                </el-form-item>
                <el-form-item label="SQE" class="el-col el-col-11">
                  <el-select></el-select>
                </el-form-item>
                <el-form-item label="SQE邮箱" class="el-col el-col-11 el-col-offset-1">
                  <el-input></el-input>
                </el-form-item>
              </el-form>
            </el-tab-pane>
          </el-tabs>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      infoData: {

      },
      radioForm: {

      },
      radioFormStrict: {

      },
      radioFormC: {

      },
      radio: '',
      radioChildren: '',
      showRadio: false,
      // AqlShow: false,
      // AqlShowStrict: false,
      // CAqlShow: false,
      checkData: [],
      decide: '',
      activeName: 'infoTab',
      decideForm: {}
    }
  },
  watch: {
    radio (val) {
      if (val === '2') {
        this.showRadio = false
        this.radioChildren = ''
      } else {
        this.showRadio = true
      }
    }
  },
  computed: {
    AqlShow () {
      return this.radioChildren === '1-1'
    },
    AqlShowStrict () {
      return this.radioChildren === '1-2'
    },
    CAqlShow () {
      return this.radioChildren === '1-3'
    },
    isdecide () {
      return this.decide === '3'
    }
  },
  methods: {
    saveData () {

    },
    closeCurrentPage () {
      this.$router.push('/BasicData/Quality/IqcList')
    }
  }

}
</script>
