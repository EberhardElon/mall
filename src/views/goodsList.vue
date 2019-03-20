<template>
  <div>
    <nav-header></nav-header>
    <nav-bread>
      <span>Goods</span>
    </nav-bread>
    <div class="accessory-result-page accessory-page">
      <div class="container">
        <div class="filter-nav">
          <span class="sortby">Sort by:</span>
          <a href="javascript:void(0)" class="default cur">Default</a>
          <a href="javascript:void(0)" class="price" @click="sortChange">Price
            <svg class="icon icon-arrow-short" v-bind:class="{'sort-up':!sortFlag}">
              <use xlink:href="#icon-arrow-short"></use>
            </svg>
          </a>
          <a href="javascript:void(0)" class="filterby stopPop" @click="showFilterBy">Filter by</a>
        </div>
        <div class="accessory-result">
          <!-- filter -->
          <div class="filter stopPop" id="filter" v-bind:class="{'filterby-show':fliterBy}">
            <dl class="filter-price">
              <dt>Price:</dt>
              <dd><a href="javascript:void(0)" v-on:click="changePrice('All')"
                     v-bind:class="{'cur':selectedPrice=='All'}">All</a></dd>
              <dd v-for="(price,index) in priceFliter">
                <a href="javascript:void(0)" @click="changePrice(index)" :class="{'cur':selectedPrice==index}">{{price.startPrice}}
                  - {{price.endPrice}}</a>
              </dd>
            </dl>
          </div>

          <!-- search result accessories list -->
          <div class="accessory-list-wrap">
            <div class="accessory-list col-4">
              <ul>
                <li v-for="item in goodsList">
                  <div class="pic">
                    <a href="#"><img v-lazy="'static/'+item.productImage" alt=""></a>
                  </div>
                  <div class="main">
                    <div class="name">{{item.productName}}</div>
                    <div class="price">{{item.salePrice | currency('￥')}}</div>
                    <div class="btn-area">
                      <a href="javascript:;" class="btn btn--m" @click="addCart(item.productId)">加入购物车</a>
                    </div>
                  </div>
                </li>

              </ul>
              <div v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="30">
                <img src="./../../static/load/loading-spinning-bubbles.svg" v-show="loadingShow">
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="md-overlay" v-show="overHide" @click="hideFliter"></div>
    <modal v-bind:md-show="mdShow" v-on:close="closeModal">
      <p slot="message">
        请先登录，否则无法加入到购物车中！
      </p>
      <div slot="btnGroup">
        <a class="btn btn--m" href="javascript:;" @click="mdShow=false">关闭</a>
      </div>
    </modal>
    <modal v-bind:md-show="mdShowCart" v-on:close="closeModal">
      <p slot="message">
        <svg class="icon-status-ok">
          <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-status-ok"></use>
        </svg>
        <span>加入购物车成功!</span>
      </p>
      <div slot="btnGroup">
        <a class="btn btn--m" href="javascript:;" @click="mdShowCart = false">继续购物</a>
        <router-link class="btn btn--m btn--red" href="javascript:;" to="/cart">查看购物车</router-link>
      </div>
    </modal>
    <nav-footer></nav-footer>
  </div>
</template>

<script>
  import './../assets/css/base.css'
  import '@/assets/css/product.css'
  import NavHeader from './../components/Header'
  import NavBread from './../components/Bread'
  import NavFooter from './../components/Footer'
  import Modal from './../components/Modal'
  import axios from "axios"

  export default {
    name: "goodsList",
    data() {
      return {
        sortFlag: true,
        page: 1,
        pageSize: 8,
        busy: false,
        goodsList: [],
        loadingShow: true,
        mdShow: false,
        mdShowCart: false,
        priceFliter: [
          {
            startPrice: 0.00,
            endPrice: 100.00
          },
          {
            startPrice: 100.00,
            endPrice: 500.00
          },
          {
            startPrice: 500.00,
            endPrice: 1000.00
          },
          {
            startPrice: 1000.00,
            endPrice: 2000.00
          }
        ],
        selectedPrice: "All",
        fliterBy: false,
        overHide: false,
      }
    },
    components: {
      NavHeader,
      NavBread,
      NavFooter,
      Modal
    },
    mounted() {
      this.getGoodsList();
    },
    methods: {
      getGoodsList(flag) {
        this.loadingShow = true;
        var param = {
          sort: this.sortFlag ? 1 : -1,
          page: this.page,
          pageSize: this.pageSize,
          priceLevel: this.selectedPrice
        }
        axios.get('/goods', {
          params: param
        }).then((res) => {
          console.log(res.data.result.list);
          this.loadingShow = false;
          if (res.data.status == '0') {
            if (flag) {
              this.goodsList = this.goodsList.concat(res.data.result.list);
              if (res.data.result.count < this.pageSize) {
                this.busy = true;
              } else {
                this.busy = false;
              }
            } else {
              this.goodsList = res.data.result.list;
            }
          } else {
            this.goodsList = [];
          }

        });
      },
      addCart(productId) {
        axios.post('/goods/addCart', {
          productId: productId
        }).then((res) => {
          if (res.data.status == '0') {
            this.mdShowCart = true;
            this.$store.commit("updateCartCount",1);
          } else {
            this.mdShow = true;
          }
        });
      },
      closeModal() {
        this.mdShow = false;
        this.mdShowCart = false;
      },
      sortChange() {
        this.sortFlag = !this.sortFlag;
        this.busy = false;
        this.page = 1;
        this.getGoodsList();
      },
      showFilterBy() {
        this.fliterBy = true;
        this.overHide = true;
      },
      hideFliter() {
        this.fliterBy = false;
        this.overHide = false;
      },
      changePrice(index) {
        this.busy = false;
        this.selectedPrice = index;
        this.page = 1;
        this.getGoodsList();
        this.hideFliter();
      },
      loadMore() {
        this.busy = true;
        setTimeout(() => {
          this.page++;
          this.getGoodsList(true);
        }, 500);
      }
    }
  }
</script>

<style>
  .sort-up {
    transform: rotate(180deg);
    transition: all .3s ease-out;
  }

  .btn:hover {
    background-color: #ffe5e6;
    transition: all .3s ease-out;
  }
</style>
