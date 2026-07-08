import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';
import { isAllowedEmail } from '@/lib/auth';
import { listDriveFolders } from '@/lib/drive';

export const dynamic = 'force-dynamic';

export interface CourseEntry {
  id: string;
  name: string;
  mimeType: string;
  group: 'courses' | 'huyen-hoc'; // nhóm hiển thị
  urls?: string[]; // link Google Drive bổ sung (nếu có nhiều folder)
}

// Danh sách khóa học cố định — nhóm "Khóa học" (giá hời) lên đầu
const STATIC_COURSES: CourseEntry[] = [
  // ── Nhóm: Khóa học (giá hời — hiển thị đầu tiên) ──
  {
    id: 'khoahoc-group-1',
    name: 'Khóa học giá hời 1',
    mimeType: 'application/vnd.google-apps.folder',
    group: 'courses',
    urls: [
      'https://drive.google.com/drive/folders/13AKCXOOp3bQw7zFePZ4rGKLlBeTFCfSa',
'https://drive.google.com/drive/folders/1yZCqXlU9j4OQTkMwYn2qTehnQd9rfows',
'https://drive.google.com/drive/folders/1GwuGmZuGk04LuvgwLUl9ahdZ1NW-2xqF',
'https://drive.google.com/drive/folders/1ggJhCt8jlNzgWCDN0Fg2cZ2Qebt5gMBh',
'https://drive.google.com/drive/folders/1-WR_ZcAOTv-OMa_IrUOhNLqik_hb-_1S',
'https://drive.google.com/drive/folders/1p4_ksj2zORF4bzFZX0C-SxrCIrxcq0qv',
'https://drive.google.com/drive/folders/1hZSyiHEiumz6SODJpkIsonVR3GJNuIKs',
'https://drive.google.com/drive/folders/1yWEG_87Qqfi41RRwuqucWM5D6wkOSt_3',
'https://drive.google.com/drive/folders/1Ehbb2qdrn_gMhLnwN0Dh26JfbqgdfsAs',
'https://drive.google.com/drive/folders/1hfb5yO0PhWYARf2uBUfVmdph3ssuFCr7',
'https://drive.google.com/drive/folders/12j3S595E6ElUw0ds-9eWqbjvL6B_sOsV',
'https://drive.google.com/drive/folders/1_3jNT62R-e9LL--fwpZijHTP3y7nAMrq',
'https://drive.google.com/drive/folders/1AOrzAjxqThV03L3SWrx62AkIvImRMfnF',
'https://drive.google.com/drive/folders/1t6Jftg3zGasQ8zAxlr8l6xsdr9FZ8rtt',
'https://drive.google.com/drive/folders/1A9baK2sh5aM4YSStauX-xfo7lTRtkqz3',
'https://drive.google.com/drive/folders/1oQsN5WPoKUnRHWbRew23XqbEy7syILDI',
'https://drive.google.com/drive/folders/1J3NzVoU6GeTUhCaiO9HZE6hsHa1nRa_n',
'https://drive.google.com/drive/folders/1kQnEFGmanDo07-XUffO_6ZrvoO1DK_oB',
'https://drive.google.com/drive/folders/16IpDbOlxJRZruMQ2nzdYFh51N9DRU6vl',
'https://drive.google.com/drive/folders/1_dXDGm1pnRLbKSE-Z6mYfnF8ml6z3nkm',
'https://drive.google.com/drive/folders/12imov_TqJ7SitW4pmeJy63hSoJkarUNh',
'https://drive.google.com/drive/folders/10kdtVUNpid2TJgRAC45AxuPGqgBaS9aB',
'https://drive.google.com/drive/folders/1gl0XINqe2WFXacs1lQid5ON7BC2Tbwo3',
'https://drive.google.com/drive/folders/125pCoREsXk2djxiQwqs2kOKUvXxnQqR8',
'https://drive.google.com/drive/folders/19ObsgJJo58tTpopk8-x64ufLPZ9ZccxR',
'https://drive.google.com/drive/folders/1xSd8bZ22zChsdYkvbpo4Ao8hFm8XoK9O',
'https://drive.google.com/drive/folders/1ft2l85OA6BxhBkVM1-H1_7TT46Fp0FZ8',
'https://drive.google.com/drive/folders/125G51p2fEiSrhebOD4ax77-S5JDEEOJs',
'https://drive.google.com/drive/folders/1dkh0MLIbY3SajgO1kMpbuDDRQnFN23iL',
'https://drive.google.com/drive/folders/1D0ybcDF37p3N5nBJpijExjELweOf3QhM',
'https://drive.google.com/drive/folders/17E1AO8cN4ae3rjvwKNgbUOkjguWYgSqP',
'https://drive.google.com/drive/folders/1KasG-k4-BjZuVq1R8ECeYqvHEWt-73do',
'https://drive.google.com/drive/folders/11esz_FZNpvjt-0QhKQEyjZJkBmM6hBJh',
'https://drive.google.com/drive/folders/1zG4p0lywSoXrR01ZVgVf3MeLpnDc82lq',
'https://drive.google.com/drive/folders/1YzzA7o_aFAUZ9TjyoiA0mJIlq4zB7VLa',
'https://drive.google.com/drive/folders/1XFCtu_DKjHYdfK9sYG35sqEK_UH2E0VK',
'https://drive.google.com/drive/folders/1S_sUGfHQ_dpeKxTv_Wt1PBwkbPGxLdlX',
'https://drive.google.com/drive/folders/1xD62lwiikbTl-oA4oJsuKkMOYWtGcUr6',
'https://drive.google.com/drive/folders/1dFSYun883rcINy-CdMWJXR5t4cxeWeuH',
'https://drive.google.com/drive/folders/1cc5z9CiKM_a-4t9jgpVR2em3xPk2qxC4',
'https://drive.google.com/drive/folders/1JfwaW5AwbC50sAmSbJPv_vW8hn2a88oV',
'https://drive.google.com/drive/folders/10c6OMVvoOuc0cv6BXf5D0LMKKTKnUomJ',
'https://drive.google.com/drive/folders/1w6QNxcHB4HexRljFgjejb8wh14-9sTdY',
'https://drive.google.com/drive/folders/17rJmJx1oSlDHYWkJXs_IL-aDcRgFBD0R',
'https://drive.google.com/drive/folders/1jRvnwUjNFAKe1waW1XWQwsT-VIfa9q6c',
'https://drive.google.com/drive/folders/1kL5Nrrdneygywk-KB8ESAAstHZftxkeH',
'https://drive.google.com/drive/folders/16FZ1dqxjlGVR2txwWlQztP84YZb-rF4R',
'https://drive.google.com/drive/folders/1ASrYY922MNSR8khLGvm_i5YfGV7D1Iw9',
'https://drive.google.com/drive/folders/1IyJCoOZ7YAp5qc2pV_yb0enxK-IWz6Qp',
'https://drive.google.com/drive/folders/1LLefmqmLem0QrQAYhLpk1RUCbs70pDa0',
'https://drive.google.com/drive/folders/1MUQadeyIj8j-gN_Nsy6fQ6wuv8hTZSeE',
'https://drive.google.com/drive/folders/1Swx68dJJAtP4EjsRIfv4oL07idL07bLz',
'https://drive.google.com/drive/folders/1AstX5CBBNkvP9Kdlmr46GYQKM-Q2K8m5',
'https://drive.google.com/drive/folders/1N_i3YhjzWoa_srrbbKQkLLZHLSZdCcFJ',
'https://drive.google.com/drive/folders/1misnNvMKmWzip7ymzReoThHAr_9nWNxc',
'https://drive.google.com/drive/folders/11Jxoly8iydda9Vs33k_CUJrm6NylzP1h',
'https://drive.google.com/drive/folders/1IwzeGBylbWlYTaXhDOgGUTGl_s7IR47O',
'https://drive.google.com/drive/folders/1sraGls18s5QAEU0Obr1Qj-5vTAtDkXvf',
'https://drive.google.com/drive/folders/1TnU2unUFe79E0UP4-2S_UuBmHyJmYqkh',
'https://drive.google.com/drive/folders/1IGT2BlAokt5qtM6wLHpYKwSKYwXVGINy',
'https://drive.google.com/drive/folders/1uIh_SWqoWujCOCOXOSl88oFWvewuwm-i',
'https://drive.google.com/drive/folders/13W0Ka0saFrkuNZdJGbRyh_O9gD8iUt9O',
'https://drive.google.com/drive/folders/1_l1KSN1P842i_lKK5-wQXiFQ_jny7qHA',
'https://drive.google.com/drive/folders/1BSa9x57ZdefKEgBsM_XE7NGWjzDRipHZ',
'https://drive.google.com/drive/folders/1Ab1mYE3f79k8R0DNxbYvlknv8xcp2Z-M',
'https://drive.google.com/drive/folders/1wboh2Qwk3rvDAFaH717hdYb-DL3iqEpM',
'https://drive.google.com/drive/folders/14EVKUXwqED5opvP6cQ6Yn4e75qgHIAfc',
'https://drive.google.com/drive/folders/1CBL487zor6nM2ql0lHx5EtVkd-HuNOze',
'https://drive.google.com/drive/folders/1CN_iOjlNZjGhkoG7iuHKPJYOeEvET2ye',
'https://drive.google.com/drive/folders/1gfw17YrGamzvg9Ke5TnNCCWavkbkNexE',
'https://drive.google.com/drive/folders/1LsmyU28KpaO0ZNWlMdXo6zHJHDudsfkh',
'https://drive.google.com/drive/folders/1y68-02PgDj84jNwyU706mm74cpIK-Fy4',
'https://drive.google.com/drive/folders/1w3wbqlzZDlkjd71Jk0oTlbeeJ755qAHQ',
'https://drive.google.com/drive/folders/1Lnyl2hk7-yqu7wbeBWGj5FnSljmNbn2E',
'https://drive.google.com/drive/folders/1qnnUmOnFtfGGA8YFtiYioYCXJxKBtsZp',
'https://drive.google.com/drive/folders/1dolA8d2j89iPxt2nVf7snhmVNTBFcsS5',
'https://drive.google.com/drive/folders/1WMUYjHFH9-zTl8y03gtcVCQZ_sllcgO6',
'https://drive.google.com/drive/folders/162g3b2yf85D7R40buQ3I2_3sU-d0YQBt',
'https://drive.google.com/drive/folders/1PTin5J7-4wsYJofhyE_-Lh2hyIY8knXI',
'https://drive.google.com/drive/folders/1zh1Kp12Dz2OnbE5ONevAyMA5cpzJhfbO',
'https://drive.google.com/drive/folders/1XmioF4xCED3x5UGHa_xPd8ZjdHOqG4JE',
'https://drive.google.com/drive/folders/1ZCuqiVlXVvQeXJ4o_erWMHu72zF29z3t',
'https://drive.google.com/drive/folders/10JHEeJg9O-7P4XyD1noswITw7Pzd271Z',
'https://drive.google.com/drive/folders/1K1ruBd8abNr6huPo7ZuHbXssuI_V6l5_',
'https://drive.google.com/drive/folders/1HulwP_8Au59X0Hm-L28WVUgythKv99-a',
'https://drive.google.com/drive/folders/1AWEhhOOq-0UQnXeC5jmqfKYkKJqTH8Fh',
'https://drive.google.com/drive/folders/1NTApj-z5U9Ksp_otbD5_CR6PyVQr9qwr',
'https://drive.google.com/drive/folders/1NcZ4Bl_F5At1pIfn-zPpLu3lpUPaFMe7',
'https://drive.google.com/drive/folders/1zHQRd2KxMR6H2I1eDlUkJ6sNESemrlCO',
'https://drive.google.com/drive/folders/10YhiqO4s432unWwfnENWDW3_iEhqHdo4',
'https://drive.google.com/drive/folders/1ovB7laL-aB9jXDBfq-U8TC5qdIoujsXo',
'https://drive.google.com/drive/folders/1Tn2yyeevXFb66Oa-PEqU38n8JOO2dF_b',
'https://drive.google.com/drive/folders/1Pw_btPumR0-0QY3jCnDzNqKiSx_dyc7M',
'https://drive.google.com/drive/folders/18VnITDDsM5ihL82LNSu8N0cdSIjPuhrN',
'https://drive.google.com/drive/folders/1x-BXS8ROs-L7erW9Gu9yzVP6bBAEJZn9',
'https://drive.google.com/drive/folders/1e8zKU7NSSXI6bqf9-0ifqj7rKtu9ePEb',
'https://drive.google.com/drive/folders/1hiLyrOtTuINCPHxZMGk1QKXxApmbkR5t',
'https://drive.google.com/drive/folders/1jjgFkLkhsfUwK4KFRg2WirOOXbx_36f8',
'https://drive.google.com/drive/folders/1U16hNGKCeJFpjCfcDX-QVLi09Bg0IhjH',
'https://drive.google.com/drive/folders/1RDanLrsN7JiXzLlPX9Pfh-vGgB07CO-3',
'https://drive.google.com/drive/folders/1HQKDWWlu9tTZlQ1TR3izfVevn_jCmJQn',
'https://drive.google.com/drive/folders/1CFs5X7kOC3plRD2xSEF2zUDQROv4zVNl',
'https://drive.google.com/drive/folders/1mYvHdx1OCoRlxrkcUU7LxaARlaGLFddp',
'https://drive.google.com/drive/folders/1xWD3vVciWq-FdUY6-hvxZSIpkQn58Vxs',
'https://drive.google.com/drive/folders/1i1_xTlm2ZTpbulpJrXiEY8QSOnebVD4k',
'https://drive.google.com/drive/folders/1DxAMdkQ-unr1F2jstU85ammMwJnCnkTE',
'https://drive.google.com/drive/folders/1-V7uLLTDQjeAIA6je1ahdf_MShfM18YG',
'https://drive.google.com/drive/folders/119bL-KIIMe4SE4c5EVKtcghcrlcHtIYU',
'https://drive.google.com/drive/folders/1JwBqB3M4y7GtyjqOKpa-YI-DSQnJugtB',
'https://drive.google.com/drive/folders/1yQCXBQ3D3oqXNBcJlfV__qVS6ZuuIL1A',
'https://drive.google.com/drive/folders/1UKrvbE64McFS5oCz9MAtIfxNNRlNnYVz',
'https://drive.google.com/drive/folders/1sCpKKXiGz4KkObmOvSOXWEEHm5kgSqoo',
'https://drive.google.com/drive/folders/14gDXMNEEe9ueh2QaqRdAdjQ--9L2eubP',
'https://drive.google.com/drive/folders/1P-NdcHIEuvFQLNjnRJRQ-qoUutJ6z192',
'https://drive.google.com/drive/folders/1_xih99Dnl5TMeQ7YKMyocbWAsI0Kl6Kv',
'https://drive.google.com/drive/folders/11Qq9z5tuDloyaAQRDqDd6D7jrgywY6Bl',
'https://drive.google.com/drive/folders/1ANlr8HpEhpppTiKrmI_qjjSbd83IszQF',
'https://drive.google.com/drive/folders/1odiGIb00fJwlUvw6qvRIzpithaK0RDad',
'https://drive.google.com/drive/folders/1j6vV59MlsibTLklDy82a7KX1kHMH_nh-',
'https://drive.google.com/drive/folders/1I_jXGbpf7kf-4uiG2dWsYLNdon1kk0q4',
'https://drive.google.com/drive/folders/1F__YdLYY4MdcV5TIjLWw4ui3Zghx2Iup',
'https://drive.google.com/drive/folders/1tWHc1XSrTbjaOrrVMl1v_PBBSTuYW6OH',
'https://drive.google.com/drive/folders/1iBzVMPvkid2sDlSq8U4-veL4W0QezUVE',
'https://drive.google.com/drive/folders/1o0p4uukzIibTY7oTPtQk1WIgon0sG7mB',
'https://drive.google.com/drive/folders/1WqMGIDArro2BkOShA7wzekEL-MiZS-JH',
'https://drive.google.com/drive/folders/1Vpr7pRmJDx3_bsMOeAJpD22njTQia3EN',
'https://drive.google.com/drive/folders/1L56Z1WHtdYy46BsrKQeVmEFEcr8jbTmL',
'https://drive.google.com/drive/folders/122jw8R_TBk8FOA4O9Z4dvGxM4UQ5aXnL',
'https://drive.google.com/drive/folders/1YFDzRoXVwW67esFXTdp9vDyUAFeeRA0g',
'https://drive.google.com/drive/folders/1bnYFK6nkp-4KCTuvv7OAWXSVsRM4OCwK',
'https://drive.google.com/drive/folders/1S3wSxKRpTexuIzR_0bzzlKF0SoOlQ9Kq',
'https://drive.google.com/drive/folders/1l7xArSbOD6cXW5rYKCMH1LiZjvePc-1x',
'https://drive.google.com/drive/folders/13MExJAcPMOR2U4Tr2eb3cIMLNr2d8qPu',
'https://drive.google.com/drive/folders/1ARx9A_GdUMYvsVnRsYNscoeOkjvFbGTh',
'https://drive.google.com/drive/folders/1d1AIaMamsl_j44p9W4xq8oEI85svZQDo',
'https://drive.google.com/drive/folders/1eEK0Bm5Dee3qxsvm3QrUm6T7eYH7N3rB',
'https://drive.google.com/drive/folders/1YdeF4_vPPOp4Q-JPDdftVjOFsJCEieII',
'https://drive.google.com/drive/folders/1xxX8LEM8kc7RLVOesnAV8ukz2d5f_ucx',
'https://drive.google.com/drive/folders/1npV_BimgQ2O9dbd6bQYiEDGSNzr383FY',
'https://drive.google.com/drive/folders/1raDUOlfQBPV5JgNLsA7vrMvzT_h1A2Tu',
'https://drive.google.com/drive/folders/1uLx4BntBM8DUxp64YCpKO3vFjkmcZDC8',
'https://drive.google.com/drive/folders/1CRj78QMMZfwJ2E_PLVhd45u8HpZNHg6t',
'https://drive.google.com/drive/folders/1x9lcCNxycNAhgrG0NteFGYYO8-pJk1od',
'https://drive.google.com/drive/folders/1tOVlYyerhYPGbXE5WetEucEX_QRJL03j',
'https://drive.google.com/drive/folders/13uB324vguVe3SzXsjwMe4f5G6l5hcsFX',
'https://drive.google.com/drive/folders/19n8PWMXhMj6B0xkKL8ORfGxvBUZ_gZJ4',
'https://drive.google.com/drive/folders/1PbHbhPLXmn4w2K6BdscQpxxsDrRHTAiF',
'https://drive.google.com/drive/folders/1Do7ez_2z5ad1gevmBSK2OKB9jW-BJ-gF',
'https://drive.google.com/drive/folders/1VMUO8tdLW44OokJtAH2YSQZEhbi7hOCF',
'https://drive.google.com/drive/folders/1E7OhZfbKfPR8Rh3qeMyQUJOY-O_uai00',
'https://drive.google.com/drive/folders/12KeK0HlKvn3E8LGe4TEm4vx9FvaU2DeQ',
'https://drive.google.com/drive/folders/1sL2iWGa3vJsH4kG4qXwl_c1OW_hFuSA5',
'https://drive.google.com/drive/folders/1d8H8FOoxzHeDaOu-CczBNIPDsILfhH1D',
'https://drive.google.com/drive/folders/13atqwyW93p4LjwVbIHGQuQz5TGM6BWzj',
    ],
  },
  {
    id: 'khoahoc-group-2',
    name: 'Khóa học giá hời 2',
    mimeType: 'application/vnd.google-apps.folder',
    group: 'courses',
    urls: [
      'https://drive.google.com/drive/folders/1pjNn2Wc_f5dLEfF023m5jvMEyF2s2fWj',
'https://drive.google.com/drive/folders/17njJLVzyVPt28FMA0ctDMETUKxhHl_Ze',
'https://drive.google.com/drive/folders/1jnfGmwCaqg2nr5e2KhVznxcc8ZQl2zY1',
'https://drive.google.com/drive/folders/1RQBvQyBK38tt2hMgw0tVosz8q7IOP_1x',
'https://drive.google.com/drive/folders/11YLRbOQM312rUJ5qw_cYrJXwACGl8MWg',
'https://drive.google.com/drive/folders/1wVKdYgulYFEXR27YKaTsMo9whJETKnRM',
'https://drive.google.com/drive/folders/16TMMs_Kr801l--XxF50pE_xx_MJC3lzH',
'https://drive.google.com/drive/folders/1YUm5IB1O8N3UsTwC71TqcZMlLsHEUfa7',
'https://drive.google.com/drive/folders/1qTOs7LZaY38dfJpT2bazNV_UVjd0Hl5c',
'https://drive.google.com/drive/folders/10SxP8Mi7tSQI7ZgImuZK54Zb7Aw2pUB9',
'https://drive.google.com/drive/folders/1nXMvNqnP6-nAi3boyvjVkFGVPT29ctvt',
'https://drive.google.com/drive/folders/1Xj9OH7TZlpECB2BoguCgX92kavV-DeJ3',
'https://drive.google.com/drive/folders/1LfM5oomTVfAtI6QqoLPLSKMzjdWQlPet',
'https://drive.google.com/drive/folders/1ECe7NYmqWmNRL8WphTmZiKJr_J-GY9kB',
'https://drive.google.com/drive/folders/1z5FB_MsV8czu2lWII8iL23CcL4RUIkxw',
'https://drive.google.com/drive/folders/1lZtmFmLx2qpOGI8K3Gn9vp00NWHEzs3J',
'https://drive.google.com/drive/folders/105qwheL9gc8ZkLIMpsN5DXvXDyfRj9FI',
'https://drive.google.com/drive/folders/1W21iwFrWCW8WCiwTZkprV7jd7pj541wX',
'https://drive.google.com/drive/folders/1SmYLQf7i4lCIhK1czkGagjLpj3WEL1HB',
'https://drive.google.com/drive/folders/1peERldELYe9n8WPaRDIxSlRvXq0MUWo_',
'https://drive.google.com/drive/folders/1C90-gdUvBly7GST4KRa5-DroL7xGcEb3',
'https://drive.google.com/drive/folders/1W2cYeuaVyrjSMKtPUahzbGCuQpJscKj5',
'https://drive.google.com/drive/folders/1S2qvETrtdbwbrE39CEoACXqTr9ExVmnC',
'https://drive.google.com/drive/folders/1sNKsJl6o3QyyWGuxHeOl2RObzuem8BoH',
'https://drive.google.com/drive/folders/1ZglU8SG_7PcD0_SgcaSVTYLKegJUKo7e',
'https://drive.google.com/drive/folders/1YHo_tJbcImObOTijkaqfZP5Kd67-Vg6Z',
'https://drive.google.com/drive/folders/16pt2cAZAwhm6CarKRmNFzMaMIov7PyBf',
'https://drive.google.com/drive/folders/1WE8p_C3RPDbsfoAZ6lAyXyMvRzmVpQpO',
'https://drive.google.com/drive/folders/1i8hViVwWwtC8J8BQAVbupICMArP7UtRL',
'https://drive.google.com/drive/folders/1vr5FmYqKeloR6SrpOIuYLERAAtKsmfSw',
'https://drive.google.com/drive/folders/1t_Dfw8WqAevo9JUvkhrCtaE84q28sNuB',
'https://drive.google.com/drive/folders/1IiP1UC0-JqipgidrbXHYmKBwAsXFH2UC',
'https://drive.google.com/drive/folders/1DG_GRSskXPSwYiLwKOwq4xdmeVvCjEJn',
'https://drive.google.com/drive/folders/1fa5mIqxwwleShflBQRHGuN0sQdBRQ2UO',
'https://drive.google.com/drive/folders/1MvKeSpaVpKecXRj0NYjhzQZT_eIPFWoo',
'https://drive.google.com/drive/folders/1pW7cXOHrL24NTNWTFdmHvlBhWqvv1XlF',
'https://drive.google.com/drive/folders/1xmKmR6b_tLiIx-Dml6_rJVrO03v4wTty',
'https://drive.google.com/drive/folders/11Dk4EvCmShe5SNBDG1oLU5ClT--q7Vz3',
'https://drive.google.com/drive/folders/1B6dhLXb1blVcH_UG8X8V4XewB1ZbYYJo',
'https://drive.google.com/drive/folders/1aPOUcfvWQQZNr8BP-WeNHZIdQVk7j8Zz',
'https://drive.google.com/drive/folders/1n9XCYNeiQKiypQ0UbZBzG6EGijsz4ET9',
'https://drive.google.com/drive/folders/1axSuPynkWuRYD_h8X-DoyAUoPGvpcWuP',
'https://drive.google.com/drive/folders/1UvraFJ6OMteXOpALoSTGo43DOFiCsnEm',
'https://drive.google.com/drive/folders/1IXZ1UDf6sx6NuTyKnQ6nLUhvMqfj5SWc',
'https://drive.google.com/drive/folders/1eoN-mhCRK9OWRwe_Yi7AmzT3-Yv0RNuV',
'https://drive.google.com/drive/folders/1gEKfojLzoxvIQN5FofW_i3nWglwD-GwG',
'https://drive.google.com/drive/folders/1kDncN-yrq0C363fL5K5tjljly5mymttQ',
'https://drive.google.com/drive/folders/1wZuq7ZJVYRd_mPPcG490V4Ss_pohq6hm',
'https://drive.google.com/drive/folders/1C9YePyeOxjeFqy5vfJM6PKxumsd6AOqK',
'https://drive.google.com/drive/folders/1ndR8TtPGxjxtEujBnnU2kHflKN9r9zy3',
'https://drive.google.com/drive/folders/18jWZyGqZ8Ir8Y1Jop6IkVtjgw4-NuLPV',
'https://drive.google.com/drive/folders/1TuuiwthYwH86I0XHU1iK5et3UGWkyhAN',
'https://drive.google.com/drive/folders/1nkzEdGilav7kezjEzbHefnACN8I7_4HI',
'https://drive.google.com/drive/folders/11Dre4i-EbMnNDJqB12f2q1rybXOLHlBS',
'https://drive.google.com/drive/folders/1NyUN9F2M8GL_ZGXAs4fOD0Amxs4Td_3F',
'https://drive.google.com/drive/folders/1GAs-eqT4XhKXsTh60zHyNC2fG6VdRDEZ',
'https://drive.google.com/drive/folders/1plQUrio8487GvrZ0bNsg0nar9u8yJ9HJ',
'https://drive.google.com/drive/folders/1LUCz_BL20cqYdx2yHyDtS3cvmgCYsuUd',
'https://drive.google.com/drive/folders/1XGX0aC7cf5ZZQ3Z5fHc7b-9Teah0zc3f',
'https://drive.google.com/drive/folders/1X-nWnqeH3PJl6uRvgDxex-cfg1ABbtX3',
'https://drive.google.com/drive/folders/1MXQTeZdUZrZl4Yw4G7wbY7qwskSpBA8Z',
'https://drive.google.com/drive/folders/1wfFyfLYEBQC1ueMG75QGNpNiSSwtByxf',
'https://drive.google.com/drive/folders/19vEwMjTz7y8-0VcAdqCWzjxtARQZ4Urd',
'https://drive.google.com/drive/folders/1fXKp_NNATJXCIYYvKHvHSy2UUTKNiE16',
'https://drive.google.com/drive/folders/1ewxk5k0Dqs7QpeRoaLZCBxPZTff0isIJ',
'https://drive.google.com/drive/folders/1mHVYbb98UJKrZM467UrFlEqheHSgxn7-',
'https://drive.google.com/drive/folders/1ItWrBb6hkRE9ixPsBqbd6w',
    ],
  },

  // ── Nhóm: Huyền học (sắp xếp theo tên) ──
  { id: '1ZjFtzFbqcLpHsuaReBiCWvTOcgN96t-A', name: '3.09 Khóa Luận Phong Thủy Nhà Cửa Thực Chiến - Thầy Cường', mimeType: 'application/vnd.google-apps.folder', group: 'huyen-hoc' },
  { id: '1miGAChJKa55NaN17aYCSagWWQQJVPE_i', name: '3.13 Khóa PT Cấp Tốc - Thầy Cường', mimeType: 'application/vnd.google-apps.folder', group: 'huyen-hoc' },
  { id: '1rn-ZMCZiyeS-FB7EptHfkfrxysVP7V-9', name: '3.15 Khóa HKPT Lý Thuyết Cơ Bản - Thầy Cường', mimeType: 'application/vnd.google-apps.folder', group: 'huyen-hoc' },
  { id: '1gg50mI_S5DD7fHMPqTiyznShRAHF7BOZ', name: '3.16 Khóa HKPT Thực Hành Nâng Cao - Thầy Cường', mimeType: 'application/vnd.google-apps.folder', group: 'huyen-hoc' },
  { id: '1PRvUEg9jNfDalRGwiwduPXNlRjp1aEgd', name: '3.17 Khóa Bát Trạch - Thầy Cường', mimeType: 'application/vnd.google-apps.folder', group: 'huyen-hoc' },
  { id: '1Yb_KhgwG2O3_zksCFeb8d-18rwA451eo', name: '3.03 Khóa Phong Thủy Tam Hợp Phái Minh Việt - Thầy Cường', mimeType: 'application/vnd.google-apps.folder', group: 'huyen-hoc' },
  { id: '1gGDG_Z0Yk6H0E85xHyupZ7NIKIrkuvM2', name: '3.01 Khóa HKDQ Minh Việt - Thầy Cường', mimeType: 'application/vnd.google-apps.folder', group: 'huyen-hoc' },
  { id: '1XaE1ZqCr6Mi648PYG1NB76VluhznjOaA', name: '2.08 Khóa Bát Tự Tứ Trụ K1 Tam Nguyên', mimeType: 'application/vnd.google-apps.folder', group: 'huyen-hoc' },
  { id: '1SFMRgIEMiVOdrlK-KqhyZPrE5wyCsUYh', name: '2.12 Khóa Bát Tự Cơ Bản - Thầy Cường', mimeType: 'application/vnd.google-apps.folder', group: 'huyen-hoc' },
  { id: '1Fi0iPalj9u-_4euRRHZO5b5fkupi4KsN', name: '1.18 Khóa Tử Vi NP 33 Video - Thầy Cường', mimeType: 'application/vnd.google-apps.folder', group: 'huyen-hoc' },
  { id: '17nfMzEa4BgccS45wtAKOtkMxlIUf711c', name: '1.32 Khóa Tử Vi NP Cơ Bản - Thầy Nguyễn Trọng Tuệ', mimeType: 'application/vnd.google-apps.folder', group: 'huyen-hoc' },
  { id: '1tGz7lgPCExvjjvA9b9GHDowQzgXt3FsF', name: '1.09 Hành Trình Tử Vi (Mộc Đầu) - 54 Video', mimeType: 'application/vnd.google-apps.folder', group: 'huyen-hoc' },
  { id: '1cPA4kpT-Se4Z_gX0I3FWG7QpPL2cyzAW', name: '1.20 Tử Vi Cơ Bản - Tống Nguyên Trung', mimeType: 'application/vnd.google-apps.folder', group: 'huyen-hoc' },
  { id: 'doc-1-33', name: '1.33 Tử Vi Nâng Cao - Nguyễn Trọng Tuệ 2025', mimeType: 'application/vnd.google-apps.document', group: 'huyen-hoc', urls: ['https://docs.google.com/document/d/19DrFweqydyB2K6Gkmm7Os5oE-ItlZZn0/edit'] },
  { id: '1vz5Xv4iNmpUtT71a6CsKNUY99h6bpCxm', name: '4.01 Khóa KD Lục Hào Cơ Bản - Minh Việt', mimeType: 'application/vnd.google-apps.folder', group: 'huyen-hoc' },
  { id: '1uuRgX7Js_s6Z35xuvXRPlvgKLIyNVNkW', name: '4.13 Khóa Bốc Dịch - Thầy Tuệ', mimeType: 'application/vnd.google-apps.folder', group: 'huyen-hoc' },
  { id: '1WXH7ZFc0OEhSz-KN7jtYit5FIJszyonf', name: '5.05 Khóa Học KMĐG - Thầy Cường', mimeType: 'application/vnd.google-apps.folder', group: 'huyen-hoc' },
  { id: '1tX_5m3HveFjfkgBS7WZ3S-tL2cNtsgsx', name: '5.11 Khóa Kỳ Môn Toàn Thư - Nguyễn Tấn Công', mimeType: 'application/vnd.google-apps.folder', group: 'huyen-hoc' },
  { id: '1tpqbkgS4AFOSS5-ZrXPjOnIzgzLVuzJj', name: '6.02 Khóa Trạch Nhật Dụng Sự - Thầy Tuệ', mimeType: 'application/vnd.google-apps.folder', group: 'huyen-hoc' },
  { id: '1_qqtQsmFNGiK9s-X-q3MEPSpQbYL2AXq', name: '6.04 Khóa Xem Ngày Tốt - Nam Việt', mimeType: 'application/vnd.google-apps.folder', group: 'huyen-hoc' },
  { id: '18pVehh8ABNkhrhJ8B4o33l7jbiVBmDfc', name: '7.08 Khóa Nhân Tướng Sơ Cấp - Thầy Cường', mimeType: 'application/vnd.google-apps.folder', group: 'huyen-hoc' },
  { id: '1v40wFmbUBu2e4s5fYzqjopEKEgJVijrI', name: '8.17 Thần Số Học - Thầy Cường', mimeType: 'application/vnd.google-apps.folder', group: 'huyen-hoc' },
  { id: '1Oso0nnoxC0IZw1fYgsq2_0n7tiY0H9hL', name: 'Khóa Tự Học Bói Bài Tây - Cô Moon', mimeType: 'application/vnd.google-apps.folder', group: 'huyen-hoc' },
  { id: '1G_vx-wvqTsMTwnNl8l7vjwOdgCftEp2a', name: 'Khóa Bói Bài Tây Nâng Cao', mimeType: 'application/vnd.google-apps.folder', group: 'huyen-hoc' },

  // ── Các khóa bổ sung ──
  { id: '1LMNdG5DDPp1mW403bgLU24oIW7c89Bxh', name: '1.27 Khâm Thiên Tứ Hóa Phái - Chiến Nguyễn (17 Video)', mimeType: 'application/vnd.google-apps.folder', group: 'huyen-hoc' },
  { id: '1rmO1MvNP7Ti1PFpZFCeszllBZo6UBpH', name: '2.09 Khóa Master Bát Tự - Nguyễn Dũng', mimeType: 'application/vnd.google-apps.folder', group: 'huyen-hoc' },
  { id: '19ghqBqRZxHc0nhgWXzanNyjks29i1jh5', name: '5.02 Khóa Kỳ Môn Độn Giáp Cơ Bản - Thầy Dũng', mimeType: 'application/vnd.google-apps.folder', group: 'huyen-hoc' },
];

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (!isAllowedEmail(session.user.email)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Sắp xếp nhóm huyen-hoc theo tên
    const sorted = [
      ...STATIC_COURSES.filter(c => c.group === 'courses'),
      ...STATIC_COURSES.filter(c => c.group === 'huyen-hoc').sort((a, b) => a.name.localeCompare(b.name, 'vi')),
    ];

    return NextResponse.json(sorted);
  } catch (error) {
    console.error('Error fetching courses:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST — thêm khóa học mới (lưu vào custom-courses.json trên server)
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email || !isAllowedEmail(session.user.email)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    const body = await req.json();
    const { name, url, group } = body as { name: string; url: string; group: 'courses' | 'huyen-hoc' };
    if (!name || !url) {
      return NextResponse.json({ error: 'name và url là bắt buộc' }, { status: 400 });
    }

    // Trích ID từ URL Drive
    const match = url.match(/folders\/([a-zA-Z0-9_-]+)/);
    const id = match ? match[1] : `custom-${Date.now()}`;

    const newEntry: CourseEntry = {
      id, name,
      mimeType: 'application/vnd.google-apps.folder',
      group: group ?? 'huyen-hoc',
      urls: [url],
    };

    // Đọc file custom nếu có, append, ghi lại
    const fs = await import('fs/promises');
    const path = await import('path');
    const filePath = path.join(process.cwd(), 'data', 'custom-courses.json');
    let existing: CourseEntry[] = [];
    try {
      const raw = await fs.readFile(filePath, 'utf-8');
      existing = JSON.parse(raw);
    } catch { /* file chưa tồn tại */ }

    existing.push(newEntry);
    await fs.mkdir(path.join(process.cwd(), 'data'), { recursive: true });
    await fs.writeFile(filePath, JSON.stringify(existing, null, 2), 'utf-8');

    return NextResponse.json({ success: true, course: newEntry });
  } catch (error) {
    console.error('POST courses error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
