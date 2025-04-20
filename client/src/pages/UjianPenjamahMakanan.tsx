import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Progress } from "@/components/ui/progress";

// Schema untuk validasi form
const examFormSchema = z.object({
  answers: z.array(
    z.object({
      questionId: z.number(),
      answer: z.string(),
    })
  ),
  agreement: z.boolean().refine(val => val === true, {
    message: "Anda harus menyetujui pernyataan ini untuk melanjutkan"
  })
});

type ExamFormValues = z.infer<typeof examFormSchema>;

// Data ujian
const examData = {
  title: "MATERI UJI KOMPETENSI SKEMA PELAKSANA PENJAMAH MAKANAN",
  description: "Ujian sertifikasi untuk Pelaksana Penjamah Makanan sesuai standar kompetensi nasional.",
  instructions: [
    "Jawablah seluruh pertanyaan dengan teliti.",
    "Pilih satu jawaban yang paling tepat untuk setiap pertanyaan.",
    "Waktu pengerjaan adalah 60 menit untuk 25 soal.",
    "Nilai minimum kelulusan adalah 70."
  ],
  sections: [
    {
      title: "Keamanan Pangan dan Higiene Personal",
      questions: [
        {
          id: 1,
          text: "Apa yang dimaksud dengan keamanan pangan?",
          options: [
            { id: "a", text: "Kondisi pangan yang tidak mengandung unsur berbahaya" },
            { id: "b", text: "Kondisi pangan yang tampak bersih" },
            { id: "c", text: "Kondisi pangan yang memiliki rasa enak" },
            { id: "d", text: "Kondisi pangan yang mahal" }
          ]
        },
        {
          id: 2,
          text: "Apa yang harus dilakukan seorang penjamah makanan sebelum dan sesudah menangani makanan?",
          options: [
            { id: "a", text: "Mencuci tangan dengan air biasa" },
            { id: "b", text: "Mencuci tangan dengan sabun antibakteri dan air mengalir" },
            { id: "c", text: "Menggunakan hand sanitizer saja" },
            { id: "d", text: "Memakai sarung tangan tanpa mencuci tangan" }
          ]
        },
        {
          id: 3,
          text: "Berikut ini adalah bahaya kontaminasi makanan, kecuali:",
          options: [
            { id: "a", text: "Bahaya Fisik" },
            { id: "b", text: "Bahaya Kimia" },
            { id: "c", text: "Bahaya Biologi" },
            { id: "d", text: "Bahaya Estetika" }
          ]
        }
      ]
    },
    {
      title: "Penanganan dan Penyimpanan Bahan Makanan",
      questions: [
        {
          id: 4,
          text: "Suhu yang tepat untuk penyimpanan bahan makanan segar (daging, ayam, ikan) adalah:",
          options: [
            { id: "a", text: "0 hingga 5 derajat Celsius" },
            { id: "b", text: "10 hingga 15 derajat Celsius" },
            { id: "c", text: "Suhu ruangan (25 derajat Celsius)" },
            { id: "d", text: "60 derajat Celsius" }
          ]
        },
        {
          id: 5,
          text: "Metode First In First Out (FIFO) dalam penanganan bahan makanan berarti:",
          options: [
            { id: "a", text: "Bahan makanan yang paling segar digunakan terlebih dahulu" },
            { id: "b", text: "Bahan makanan yang paling mahal digunakan terlebih dahulu" },
            { id: "c", text: "Bahan makanan yang pertama datang digunakan terlebih dahulu" },
            { id: "d", text: "Bahan makanan yang terakhir datang digunakan terlebih dahulu" }
          ]
        },
        {
          id: 6,
          text: "Hal yang tidak boleh dilakukan saat menyimpan bahan makanan di lemari pendingin adalah:",
          options: [
            { id: "a", text: "Memisahkan bahan mentah dan matang" },
            { id: "b", text: "Menutup rapat setiap wadah makanan" },
            { id: "c", text: "Menyimpan bahan mentah di rak bawah" },
            { id: "d", text: "Menyimpan makanan matang dan mentah dalam wadah yang sama" }
          ]
        }
      ]
    },
    {
      title: "Pengolahan dan Penyajian Makanan",
      questions: [
        {
          id: 7,
          text: "Suhu minimum yang aman untuk memasak daging ayam hingga matang adalah:",
          options: [
            { id: "a", text: "50 derajat Celsius" },
            { id: "b", text: "63 derajat Celsius" },
            { id: "c", text: "74 derajat Celsius" },
            { id: "d", text: "85 derajat Celsius" }
          ]
        },
        {
          id: 8,
          text: "Suhu yang aman untuk penyajian makanan panas adalah:",
          options: [
            { id: "a", text: "Di atas 60 derajat Celsius" },
            { id: "b", text: "Antara 40-50 derajat Celsius" },
            { id: "c", text: "Antara 20-30 derajat Celsius" },
            { id: "d", text: "Di bawah 5 derajat Celsius" }
          ]
        },
        {
          id: 9,
          text: "Talenan (cutting board) yang berbeda warna digunakan untuk:",
          options: [
            { id: "a", text: "Membedakan jenis masakan yang dibuat" },
            { id: "b", text: "Membedakan koki yang menggunakannya" },
            { id: "c", text: "Membedakan jenis bahan makanan yang dipotong untuk mencegah kontaminasi silang" },
            { id: "d", text: "Hanya untuk estetika dapur" }
          ]
        }
      ]
    },
    {
      title: "Sanitasi dan Higiene Tempat Kerja",
      questions: [
        {
          id: 10,
          text: "Desinfeksi permukaan kerja dapur sebaiknya dilakukan:",
          options: [
            { id: "a", text: "Sekali sehari" },
            { id: "b", text: "Seminggu sekali" },
            { id: "c", text: "Sebelum dan setelah penggunaan" },
            { id: "d", text: "Hanya saat terlihat kotor" }
          ]
        },
        {
          id: 11,
          text: "Bahan kimia pembersih dan pestisida seharusnya disimpan:",
          options: [
            { id: "a", text: "Di dekat kompor untuk kemudahan akses" },
            { id: "b", text: "Di ruang yang sama dengan bahan makanan" },
            { id: "c", text: "Di area yang terpisah dari bahan makanan dan peralatan masak" },
            { id: "d", text: "Di rak terbuka di dapur" }
          ]
        },
        {
          id: 12,
          text: "Langkah yang tepat untuk membersihkan peralatan masak adalah:",
          options: [
            { id: "a", text: "Mencuci, membilas, mengeringkan" },
            { id: "b", text: "Membuang sisa makanan, mencuci dengan detergen, membilas dengan air bersih, sanitasi, pengeringan" },
            { id: "c", text: "Merendam dalam air hangat, mengeringkan" },
            { id: "d", text: "Menyikat peralatan, membilas dengan air, menggunakan" }
          ]
        }
      ]
    },
    {
      title: "Pengetahuan dan Implementasi HACCP",
      questions: [
        {
          id: 13,
          text: "HACCP adalah singkatan dari:",
          options: [
            { id: "a", text: "Health And Clean Cooking Process" },
            { id: "b", text: "Hazard Analysis Critical Control Point" },
            { id: "c", text: "Hygiene Assessment of Contamination Control Protocol" },
            { id: "d", text: "Healthy And Clean Cooking Procedure" }
          ]
        },
        {
          id: 14,
          text: "Zona bahaya (danger zone) untuk pertumbuhan bakteri pada makanan adalah pada suhu:",
          options: [
            { id: "a", text: "Di bawah 0 derajat Celsius" },
            { id: "b", text: "Antara 5-60 derajat Celsius" },
            { id: "c", text: "Di atas 100 derajat Celsius" },
            { id: "d", text: "Antara 75-85 derajat Celsius" }
          ]
        },
        {
          id: 15,
          text: "Titik kendali kritis (critical control point) adalah:",
          options: [
            { id: "a", text: "Titik di mana bahaya dapat dicegah, dihilangkan, atau dikurangi hingga tingkat yang dapat diterima" },
            { id: "b", text: "Titik di mana makanan harus dihidangkan" },
            { id: "c", text: "Titik di mana koki kepala melakukan inspeksi" },
            { id: "d", text: "Titik di mana terjadi kontaminasi" }
          ]
        }
      ]
    }
  ]
};

const UjianPenjamahMakanan: React.FC = () => {
  const { toast } = useToast();
  const [currentSection, setCurrentSection] = useState(0);
  const [showResults, setShowResults] = useState(false);
  
  // Setup form
  const form = useForm<ExamFormValues>({
    resolver: zodResolver(examFormSchema),
    defaultValues: {
      answers: examData.sections.flatMap(section => 
        section.questions.map(q => ({
          questionId: q.id,
          answer: "",
        }))
      ),
      agreement: false
    },
  });

  const allQuestions = examData.sections.flatMap(section => section.questions);
  const totalQuestions = allQuestions.length;
  const answeredQuestions = form.watch("answers").filter(a => a.answer !== "").length;
  const progress = (answeredQuestions / totalQuestions) * 100;

  // Handle moving between sections
  const goToNextSection = () => {
    if (currentSection < examData.sections.length - 1) {
      setCurrentSection(currentSection + 1);
      window.scrollTo(0, 0);
    }
  };

  const goToPrevSection = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
      window.scrollTo(0, 0);
    }
  };

  // Form submission
  const onSubmit = (data: ExamFormValues) => {
    console.log("Form data:", data);
    
    // Simulate submission to server
    setTimeout(() => {
      setShowResults(true);
      toast({
        title: "Ujian berhasil diselesaikan",
        description: "Terima kasih telah menyelesaikan ujian. Hasil akan diproses oleh tim LSP."
      });
    }, 1500);
  };

  // Calculate "score" for demo purposes
  const calculateScore = () => {
    // Simulate scoring (in a real app this would be calculated on the server)
    const correctAnswers = [
      {questionId: 1, answer: "a"},
      {questionId: 2, answer: "b"},
      {questionId: 3, answer: "d"},
      {questionId: 4, answer: "a"},
      {questionId: 5, answer: "c"},
      {questionId: 6, answer: "d"},
      {questionId: 7, answer: "c"},
      {questionId: 8, answer: "a"},
      {questionId: 9, answer: "c"},
      {questionId: 10, answer: "c"},
      {questionId: 11, answer: "c"},
      {questionId: 12, answer: "b"},
      {questionId: 13, answer: "b"},
      {questionId: 14, answer: "b"},
      {questionId: 15, answer: "a"},
    ];
    
    const userAnswers = form.getValues().answers;
    let correctCount = 0;
    
    correctAnswers.forEach(ca => {
      const userAnswer = userAnswers.find(ua => ua.questionId === ca.questionId);
      if (userAnswer && userAnswer.answer === ca.answer) {
        correctCount++;
      }
    });
    
    return Math.round((correctCount / correctAnswers.length) * 100);
  };

  if (showResults) {
    const score = calculateScore();
    const isPassed = score >= 70;
    
    return (
      <div className="container mx-auto py-8 px-4">
        <Helmet>
          <title>Hasil Ujian | LSP Wirausaha Kompeten Nusantara</title>
        </Helmet>
        
        <Card className="w-full max-w-4xl mx-auto">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-primary">Hasil Ujian Kompetensi</CardTitle>
            <CardDescription>
              Skema: Pelaksana Penjamah Makanan
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="border rounded-md p-6 text-center">
              <h3 className="text-xl font-semibold mb-2">Skor Anda</h3>
              <div className="text-4xl font-bold text-primary mb-2">{score}%</div>
              <div className={`text-lg font-medium ${isPassed ? 'text-green-600' : 'text-red-600'}`}>
                {isPassed ? 'Kompeten' : 'Belum Kompeten'}
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Keterangan:</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>Batas minimum kelulusan: 70%</li>
                <li>Total soal: {totalQuestions} soal</li>
                <li>Soal yang dijawab: {answeredQuestions} soal</li>
              </ul>
              
              <div className="border-t pt-4 mt-4">
                <p className="font-medium">Hasil ujian Anda akan diverifikasi oleh tim asesor LSP.</p>
                <p>Anda akan dihubungi untuk langkah selanjutnya dalam proses sertifikasi.</p>
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-center">
            <Button onClick={() => window.location.href = "/"}>
              Kembali ke Beranda
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <Helmet>
        <title>Ujian Penjamah Makanan | LSP Wirausaha Kompeten Nusantara</title>
      </Helmet>
      
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader className="bg-primary/5">
          <CardTitle className="text-2xl text-primary">{examData.title}</CardTitle>
          <CardDescription className="text-base">
            {examData.description}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="pt-6">
          {currentSection === 0 && (
            <div className="mb-6 space-y-4">
              <h3 className="text-lg font-semibold">Petunjuk Pengerjaan:</h3>
              <ul className="list-disc pl-5 space-y-2">
                {examData.instructions.map((instruction, i) => (
                  <li key={i}>{instruction}</li>
                ))}
              </ul>
              <Separator className="my-4" />
            </div>
          )}
          
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-semibold">
                Bagian {currentSection + 1}: {examData.sections[currentSection].title}
              </h3>
              <div className="text-sm text-muted-foreground">
                {answeredQuestions}/{totalQuestions} soal dijawab
              </div>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {examData.sections[currentSection].questions.map((question) => (
                <div key={question.id} className="border rounded-md p-4 shadow-sm">
                  <h4 className="font-medium mb-3">{question.id}. {question.text}</h4>
                  
                  <FormField
                    control={form.control}
                    name={`answers.${form.getValues().answers.findIndex(a => a.questionId === question.id)}.answer`}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <RadioGroup 
                            onValueChange={field.onChange} 
                            value={field.value}
                            className="space-y-2"
                          >
                            {question.options.map((option) => (
                              <div key={option.id} className="flex items-center space-x-2">
                                <RadioGroupItem value={option.id} id={`q${question.id}-${option.id}`} />
                                <Label 
                                  htmlFor={`q${question.id}-${option.id}`}
                                  className="text-sm leading-snug"
                                >
                                  {option.text}
                                </Label>
                              </div>
                            ))}
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              ))}
              
              {currentSection === examData.sections.length - 1 && (
                <div className="border rounded-md p-4 shadow-sm">
                  <FormField
                    control={form.control}
                    name="agreement"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>
                            Saya menyatakan bahwa ujian ini saya kerjakan sendiri tanpa bantuan orang lain
                            dan saya bersedia menerima hasil sesuai dengan kemampuan saya
                          </FormLabel>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
              )}
              
              <div className="flex justify-between pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={goToPrevSection}
                  disabled={currentSection === 0}
                >
                  Sebelumnya
                </Button>
                
                {currentSection < examData.sections.length - 1 ? (
                  <Button type="button" onClick={goToNextSection}>
                    Selanjutnya
                  </Button>
                ) : (
                  <Button 
                    type="submit" 
                    disabled={
                      answeredQuestions < totalQuestions || 
                      !form.getValues().agreement
                    }
                  >
                    Selesai Ujian
                  </Button>
                )}
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default UjianPenjamahMakanan;