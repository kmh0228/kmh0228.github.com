<template>
  <div class="mes-main mes-work-order mes-handle">
     <div class="mes-main-header_bg" style="color:#3B6F9A"></div>
       <div class="mes-handle-content">
      <el-row :gutter="15">
        <el-col :span="24">
          <el-button type="primary" plain size="mini" @click="saveWorkOrder">{{$t('common_save')}}</el-button>
          <el-button type="primary" plain size="mini" @click="closeCurrentPage">{{$t('common_close')}}</el-button>
        </el-col>
      </el-row>
      <div class="mes-main-tabs" style="margin-top:10px;">
         <el-tabs v-model="activeName" >
            <el-tab-pane :label="$t('common_BasicInfo')" name="infoTab">
              <el-form v-model="infoData"  label-width="90px" label-position="left" class="el-row mes-form-rule"  >
                <el-form-item :label="$t('common_PorN')" class="el-col el-col-7">
                  <el-input size="mini" ></el-input>
                </el-form-item>
                  <el-form-item :label="$t('IqcList_SupplierItemNo')" class="el-col el-col-7 el-col-offset-1">
                  <el-input size="mini" ></el-input>
                </el-form-item>
                  <el-form-item :label="$t('common_numbe')" class="el-col el-col-7 el-col-offset-1">
                  <el-input size="mini" ></el-input>
                </el-form-item>
                  <el-form-item :label="$t('IqcList_WarehouseCode')" class="el-col el-col-7">
                  <el-input size="mini" ></el-input>
                </el-form-item>
                  <el-form-item :label="$t('IqcList_MaterialCategory')" class="el-col el-col-7 el-col-offset-1">
                  <el-input size="mini" ></el-input>
                </el-form-item>
                  <el-form-item :label="$t('common_ProduName')" class="el-col el-col-7 el-col-offset-1">
                  <el-input size="mini" ></el-input>
                </el-form-item>
                  <el-form-item :label="$t('common_StockInNo')" class="el-col el-col-7">
                  <el-input size="mini" ></el-input>
                </el-form-item>
                  <el-form-item :label="$t('common_SupplName')" class="el-col el-col-7 el-col-offset-1">
                  <el-input size="mini" ></el-input>
                </el-form-item>
                  <el-form-item :label="$t('common_SupplCode')" class="el-col el-col-7 el-col-offset-1">
                  <el-input size="mini" ></el-input>
                </el-form-item>
                  <el-form-item :label="$t('IqcList_PurchaseOrderNo')" class="el-col el-col-7">
                  <el-input size="mini" ></el-input>
                </el-form-item>
                  <el-form-item :label="$t('IqcList_InspectionSpecificationNo')" class="el-col el-col-7 el-col-offset-1">
                  <el-input size="mini" ></el-input>
                </el-form-item>
                  <el-form-item :label="$t('IqcList_InspectionRegulationRevision')" class="el-col el-col-7 el-col-offset-1">
                  <el-input size="mini" ></el-input>
                </el-form-item>
                  <el-form-item :label="$t('common_InspeDate')" class="el-col el-col-7">
                  <el-input size="mini" ></el-input>
                </el-form-item>
                  <el-form-item :label="$t('common_BatchNumb')" class="el-col el-col-7 el-col-offset-1">
                  <el-input size="mini" ></el-input>
                </el-form-item>
              </el-form>
            </el-tab-pane>
            <el-tab-pane  :label="$t('IqcList_SamplingSetting')" name="sampling">
              <el-radio v-model="radio" label="1">{{$t('IqcList_Sampling')}}</el-radio>
              <el-radio v-model="radio" label="2">{{$t('IqcList_InspectionExemption')}}</el-radio>
              <div v-show="showRadio" style="margin-top:1.5vh">
                <el-radio v-model="radioChildren" label="1-1">ANSI/ASQ Z1.4 2008 —— {{$t('IqcList_General')}}</el-radio>
                <el-radio v-model="radioChildren" label="1-2">ANSI/ASQ Z1.4 2008 —— {{$t('IqcList_General')}}</el-radio>
                <el-radio v-model="radioChildren" label="1-3">c=0</el-radio>
              </div>
              <el-form :model="radioForm"  label-width="90px" label-position="left" class="el-row mes-form-rule" v-if="AqlShow" style="margin-top:1.5vh">
                <el-form-item label="AQL" class="el-col el-col-5">
                  <el-select>
                    <el-option></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item :label="$t('IqcList_SamplingNumber')" class="el-col el-col-5 el-col-offset-1">
                  <el-input size="mini" > </el-input>
                </el-form-item>
                  <el-form-item :label="$t('common_NumbeDefe')" class="el-col el-col-5 el-col-offset-1">
                  <el-input size="mini" > </el-input>
                </el-form-item>
                  <el-form-item :label="$t('IqcList_DefectRate')" class="el-col el-col-5 el-col-offset-1">
                  <el-input size="mini" > </el-input>
                </el-form-item>
              </el-form>
               <el-form :model="radioFormStrict"  label-width="90px" label-position="left" class="el-row mes-form-rule" v-if="AqlShowStrict" style="margin-top:1.5vh">
                <el-form-item label="AQL" class="el-col el-col-5">
                  <el-select>
                    <el-option></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item :label="$t('IqcList_SamplingNumber')" class="el-col el-col-5 el-col-offset-1">
                  <el-input size="mini" > </el-input>
                </el-form-item>
                  <el-form-item :label="$t('common_NumbeDefe')" class="el-col el-col-5 el-col-offset-1">
                  <el-input size="mini" > </el-input>
                </el-form-item>
                  <el-form-item :label="$t('IqcList_DefectRate')" class="el-col el-col-5 el-col-offset-1">
                  <el-input size="mini" > </el-input>
                </el-form-item>
              </el-form>
              <el-form :model="radioFormC"  label-width="80px" label-position="left" class="el-row mes-form-rule" v-if="CAqlShow" style="margin-top:1.5vh">
                <el-form-item :label="$t('IqcList_SamplingPlan')" class="el-col el-col-4">
                  <el-select>
                    <el-option></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="AQL" class="el-col el-col-4 el-col-offset-1">
                  <el-select>
                    <el-option></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item :label="$t('IqcList_SamplingNumber')" class="el-col el-col-4 el-col-offset-1">
                  <el-input size="mini" > </el-input>
                </el-form-item>
                  <el-form-item :label="$t('common_NumbeDefe')" class="el-col el-col-4 el-col-offset-1">
                  <el-input size="mini" > </el-input>
                </el-form-item>
                  <el-form-item :label="$t('IqcList_DefectRate')" class="el-col el-col-4 el-col-offset-1">
                  <el-input size="mini" > </el-input>
                </el-form-item>
              </el-form>
            </el-tab-pane>
            <el-tab-pane :label="$t('common_InspeRecord')" name='record'>
              <el-table :data="checkData" border>
                <el-table-column type="index" :label="$t('common_item')" align="center"></el-table-column>
                <el-table-column :label="$t('common_InspeItem')" align="center" ></el-table-column>
                <el-table-column :label="$t('common_InspeCont')" align="center"></el-table-column>
                <el-table-column :label="$t('common_Speci')" align="center"></el-table-column>
                <el-table-column :label="$t('IqcList_SamplingNumber')" align="center"></el-table-column>
                <el-table-column :label="$t('common_Unit')" align="center"></el-table-column>
                <el-table-column :label="$t('IqcList_TestingTools')" align="center"></el-table-column>
                <el-table-column :label="$t('common_detecResu')" align="center"></el-table-column>
              </el-table>
            </el-tab-pane>
            <el-tab-pane :label="$t('IqcList_DefectCategory')" name="category">
                <el-button>{{$t('common_Add')}}</el-button>
                <el-table :data="harmData" border style="margin-top:1.5vh">
                  <el-table-column type="index" :label="$t('common_item')" align="center"></el-table-column>
                  <el-table-column :label="$t('IqcList_DefectiveName')" align="center"></el-table-column>
                  <el-table-column :label="$t('common_remarks')" align="center"></el-table-column>
                  <el-table-column :label="$t('common_numbe')" align="center"></el-table-column>
                  <el-table-column :label="$t('common_Operate')" align="center">
                    <el-button type="danger" icon="el-icon-delete" size="mini" ></el-button>
                  </el-table-column>
                </el-table>
            </el-tab-pane>
             <el-tab-pane :label="$t('IqcList_Judgment')" name="determine">
              <el-radio v-model="decide" label="1">{{$t('common_quali')}}</el-radio>
              <el-radio v-model="decide" label="2">{{$t('IqcList_Rejection')}}</el-radio>
              <el-radio v-model="decide" label="3">{{$t('common_SpeciColl')}}</el-radio>
              <el-radio v-model="decide" label="4">{{$t('common_choos')}}</el-radio>
              <el-form :model="decideForm"   label-width="180px" label-position="left" class="el-row mes-form-rule" v-if="isdecide" style="padding-top:1.5vh">
                <el-form-item :label="$t('IqcList_SpecialPurchaseOrder')" class="el-col el-col-11">
                  <el-input></el-input>
                </el-form-item>
                <el-form-item :label="$t('IqcList_SupplierAbnormalContactList')" class="el-col el-col-11 el-col-offset-1">
                  <el-input></el-input>
                </el-form-item>
                <el-form-item label="SQE" class="el-col el-col-11">
                  <el-select></el-select>
                </el-form-item>
                <el-form-item :label="$t('IqcList_email')" class="el-col el-col-11 el-col-offset-1">
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
