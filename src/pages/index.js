import fs from 'fs'
import path from 'path'

export default function Home({ exams }) {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6">英语单词测试题库</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {exams.map((exam, index) => (
          <div key={index}>
            <div className="h-full border rounded-lg shadow-sm">
              <div className="p-4">
                <div className="flex flex-col">
                  <p className="text-md">{exam.title} &rarr;</p>
                </div>
              </div>
              <hr className="border-gray-200" />
              <div className="p-4">
                <p className="text-gray-600 mb-4">{exam.description}</p>
                <small className="text-gray-500">答题时间：{exam.time}秒</small>
              </div>
              <hr className="border-gray-200" />
              <div className="p-4">
                <a 
                  href={`/exam/${exam.id}`}
                  className="text-blue-600 hover:text-blue-800 inline-flex items-center gap-1"
                >
                  开始测试
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export async function getStaticProps() {
  const dataDir = path.join(process.cwd(), 'src/data');
  const filenames = fs.readdirSync(dataDir);

  const exams = filenames.map((filename) => {
    const filePath = path.join(dataDir, filename);
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(fileContents);
    return {
      id: filename.replace(/\.json$/, ''),
      title: data.title,
      description: data.description,
      time: data.time,
    };
  });

  return { props: { exams } };
}
