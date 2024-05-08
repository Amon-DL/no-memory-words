document.addEventListener('DOMContentLoaded', function () {
  // 定义数据文件的路径
  const dataUrl = './data/data.json'; // 获取选择的数据文件路径
  let currentPage = 1; // 当前页数
  let totalPage; // 总页数
  const wordsElement = document.querySelector('.word-list'); // 包含单词的元素

  const xhr = new XMLHttpRequest(); // 创建XMLHttpRequest对象
  let data; // 存储从数据文件中获取的数据
  // 分组后的数据
  let groupedData = [];

  xhr.onreadystatechange = function () {
    // 当数据请求状态改变时执行的函数
    if (xhr.readyState === XMLHttpRequest.DONE) {
      if (xhr.status === 200) {
        // 如果状态为成功
        data = JSON.parse(xhr.responseText); // 解析数据
        groupedData = paginate(data);
        totalPage = groupedData.length  // 计算总页数
        currentPage = +localStorage.getItem('currentPage') || currentPage    // 从本地存储中获取当前页数
        addNewWords(currentPage); // 添加当前页的单词
        updatePageControls(); // 更新分页控件
        // console.log(data); // 打印数据到控制台

        // console.log(paginate(data))
      } else {
        console.error(xhr.statusText); // 打印错误信息到控制台
      }
    }
  };

  xhr.open('GET', `${dataUrl}`, true); // 打开一个新的URL请求
  xhr.send(); // 发送数据请求

  function addNewWords(page) {
    // 添加新单词到指定页的函数
    wordsElement.innerHTML = ''; // 清空单词的显示区域
    const currentPageData = groupedData[page - 1]; // 获取当前页的数据

    currentPageData.forEach(item => {
      // 遍历当前页的数据并创建单词元素
      const div = document.createElement('div'); // 创建一个新的div元素
      div.classList.add('words'); // 添加类名'words'
      div.innerHTML = `
            <div class="word">
              <p><a href="${item.url}">${item.word}</a></p>
            </div>
            <div class="memory-method">
              <ul>
                <li><span>记忆</span><p>${item.memoryTechnique}</p></li>
                <li><span>例句</span><p>${item.exampleSentence}</p></li>
                <li><span class="word-meaning" style="cursor:pointer;">意思</span><p style="display:none;">${item.meaning}</p></li>
              </ul>
            </div>
          `;
      wordsElement.appendChild(div); // 将创建的单词元素添加到显示区域
    });
  }

  function updatePageControls() {
    // 更新分页控件的函数
    const pageInfo = document.getElementById('page-info'); // 获取分页信息元素
    pageInfo.textContent = `第 ${currentPage} 页，共 ${totalPage} 页`; // 更新分页信息内容

    const prevBtn = document.getElementById('prev'); // 获取上一页按钮元素
    const nextBtn = document.getElementById('next'); // 获取下一页按钮元素

    prevBtn.disabled = currentPage === 1; // 如果当前页为第一页，则禁用上一页按钮
    nextBtn.disabled = currentPage === totalPage; // 如果当前页为最后一页，则禁用下一页按钮
  }

  // 添加上一页按钮的点击事件
  document.getElementById('prev').addEventListener('click', function () {
    if (currentPage > 1) {
      currentPage--; // 当前页数减一
      localStorage.setItem('currentPage', currentPage.toString())    // 将当前页数保存到本地存储中
      addNewWords(currentPage); // 添加当前页的单词
      updatePageControls(); // 更新分页控件
    }
  });

  // 添加下一页按钮的点击事件
  document.getElementById('next').addEventListener('click', function () {
    if (currentPage < totalPage) {
      currentPage++; // 当前页数加一
      localStorage.setItem('currentPage', currentPage.toString())    // 将当前页数保存到本地存储中
      addNewWords(currentPage); // 添加当前页的单词
      updatePageControls(); // 更新分页控件
    }
  });

  // 使用事件委托来添加意思的点击事件
  wordsElement.addEventListener('click', function (e) {
    if (e.target && e.target.className.includes('word-meaning')) {
      // 当点击的是单词意思的元素时
      const meaningPara = e.target.nextElementSibling; // 获取意思的p元素
      if (meaningPara) {
        meaningPara.style.display = meaningPara.style.display === 'block' ? 'none' : 'block'; // 切换意思的显示状态
      }
    }
  });
});

function paginate(arr) {
  const result = [];
  let page = [];

  // 使用 forEach 遍历数组
  arr.forEach((item, index) => {
    // 将当前元素添加到当前页面中
    if (!item.nextPage) page.push(item);

    // 如果当前元素的 nextPage 为 true 或者已到数组末尾
    if (item.nextPage || index === arr.length - 1) {
      // 将当前页面添加到结果中，并重置 page 为新的空数组
      result.push(page);
      page = [];
    }
  });

  return result;
}
