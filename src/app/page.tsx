
'use client';

import { useEffect, useRef, useState, type FC } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { analyzeWordAction, type AnalysisState } from '@/app/actions';
import type { Path } from '@/lib/solver';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Languages, Pilcrow, Hash, Rows3, ChevronRight, AlertCircle, Lightbulb } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"


const initialState: AnalysisState = {
  analysis: null,
  languageFamilies: null,
  error: undefined,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" aria-disabled={pending} className="w-full sm:w-auto bg-primary hover:bg-primary/90">
      {pending ? 'Analyzing...' : 'Analyze Word'}
    </Button>
  );
}

const PrimaryPathCard: FC<{ path: Path }> = ({ path }) => (
  <Card className="animate-fade-in">
    <CardHeader>
      <CardTitle className="flex items-center gap-2 font-headline">
        <Pilcrow className="text-primary" />
        Primary Path
      </CardTitle>
      <CardDescription>The most likely phonetic interpretation.</CardDescription>
    </CardHeader>
    <CardContent className="space-y-4 font-body">
      <div className="flex items-center justify-between">
        <span className="text-muted-foreground">Voice Path</span>
        <span className="font-code text-lg text-primary">{path.voicePath.join('')}</span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-muted-foreground">Ring Path</span>
        <span className="font-code text-primary">{path.ringPath.join(' ')}</span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-muted-foreground">Level Path</span>
        <span className="font-code text-primary">{path.levelPath.join(' ')}</span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-muted-foreground">Checksums</span>
        <div className="flex gap-2">
          {path.checksums.map((sum) => (
            <Badge key={sum.type} variant="secondary" className="bg-accent/20 text-accent-foreground">{sum.type}: {sum.value}</Badge>
          ))}
        </div>
      </div>
    </CardContent>
  </Card>
);

const LanguageFamiliesCard: FC<{ families: string[] }> = ({ families }) => (
  <Card className="animate-fade-in">
    <CardHeader>
      <CardTitle className="flex items-center gap-2 font-headline">
        <Languages className="text-primary" />
        Language Families
      </CardTitle>
      <CardDescription>Potential linguistic origins based on the voice path.</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="flex flex-wrap gap-2">
        {families.length > 0 ? families.map((family) => (
          <Badge key={family} className="bg-accent text-accent-foreground hover:bg-accent/90 text-sm py-1 px-3">
            {family}
          </Badge>
        )) : <p className="text-muted-foreground text-sm">No specific language families identified.</p>}
      </div>
    </CardContent>
  </Card>
);

const FrontierPathsTable: FC<{ paths: Path[] }> = ({ paths }) => (
  <Card className="lg:col-span-2 animate-fade-in">
    <CardHeader>
      <CardTitle className="flex items-center gap-2 font-headline">
        <Rows3 className="text-primary" />
        Frontier Paths
      </CardTitle>
      <CardDescription>Alternative phonetic interpretations of the word.</CardDescription>
    </CardHeader>
    <CardContent>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead><Pilcrow className="inline-block mr-2 h-4 w-4" />Voice Path</TableHead>
            <TableHead><ChevronRight className="inline-block mr-2 h-4 w-4" />Ring Path</TableHead>
            <TableHead><Rows3 className="inline-block mr-2 h-4 w-4" />Level Path</TableHead>
            <TableHead className="text-right"><Hash className="inline-block mr-2 h-4 w-4" />Checksums</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paths.map((path, index) => (
            <TableRow key={index}>
              <TableCell className="font-code text-primary">{path.voicePath.join('')}</TableCell>
              <TableCell className="font-code">{path.ringPath.join(' ')}</TableCell>
              <TableCell className="font-code">{path.levelPath.join(' ')}</TableCell>
              <TableCell className="text-right font-code">
                <div className="flex justify-end gap-2">
                  {path.checksums.map((sum) => (
                    <Badge key={sum.type} variant="secondary">{sum.type}: {sum.value}</Badge>
                  ))}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </CardContent>
  </Card>
);

const AnalysisSkeleton: FC = () => (
  <div className="mt-8 space-y-6">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-1/2" />
          <Skeleton className="h-4 w-3/4 mt-2" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-full" />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-1/2" />
          <Skeleton className="h-4 w-3/4 mt-2" />
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex flex-wrap gap-2">
            <Skeleton className="h-8 w-24 rounded-full" />
            <Skeleton className="h-8 w-32 rounded-full" />
            <Skeleton className="h-8 w-28 rounded-full" />
          </div>
        </CardContent>
      </Card>
    </div>
    <Card className="lg:col-span-2">
      <CardHeader>
        <Skeleton className="h-6 w-1/3" />
        <Skeleton className="h-4 w-1/2 mt-2" />
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </CardContent>
    </Card>
  </div>
);

export default function LinguisticDecoderPage() {
  const [showSkeleton, setShowSkeleton] = useState(false);
  const [state, formAction] = useFormState(analyzeWordAction, initialState);
  const formRef = useRef<HTMLFormElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const formActionWithLoading = async (formData: FormData) => {
    setShowSkeleton(true);
    formAction(formData);
  };

  useEffect(() => {
    if (state.analysis || state.error) {
      setShowSkeleton(false);
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [state]);
  
  return (
    <div className="bg-background min-h-screen">
      <main className="container mx-auto px-4 py-8 sm:py-12 md:py-16">
        <header className="text-center mb-8 md:mb-12">
          <div className="inline-flex items-center gap-3">
            <Languages className="h-10 w-10 text-primary" />
            <h1 className="text-4xl sm:text-5xl font-bold font-headline tracking-tight">
              Linguistic Decoder
            </h1>
          </div>
          <p className="mt-4 text-lg max-w-2xl mx-auto text-muted-foreground">
            Uncover the phonetic structure and potential origins of words with the Seven-Voices solver and AI-powered analysis.
          </p>
        </header>

        <Card className="max-w-2xl mx-auto shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline">Analyze a Word</CardTitle>
            <CardDescription>Enter a word to calculate its voice paths and map its linguistic family.</CardDescription>
          </CardHeader>
          <CardContent>
            <form action={formActionWithLoading} ref={formRef} className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                  <Input
                  name="word"
                  placeholder="e.g., 'damage'"
                  required
                  className="flex-grow text-lg"
                  />
                  <SubmitButton />
              </div>
              <div className="flex items-center gap-4 pt-2">
                  <span className="text-sm font-medium text-card-foreground">Analysis Mode:</span>
                  <RadioGroup defaultValue="strict" name="mode" className="flex items-center">
                      <div className="flex items-center space-x-2">
                          <RadioGroupItem value="strict" id="mode-strict" />
                          <Label htmlFor="mode-strict" className="font-normal">Strict</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                          <RadioGroupItem value="open" id="mode-open" />
                          <Label htmlFor="mode-open" className="font-normal">Open</Label>
                      </div>
                  </RadioGroup>
              </div>
            </form>
          </CardContent>
        </Card>

        <div ref={resultsRef} className="mt-8 md:mt-12">
          {showSkeleton && <AnalysisSkeleton />}
          
          {!showSkeleton && state.error && (
            <div className="max-w-2xl mx-auto">
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Analysis Error</AlertTitle>
                <AlertDescription>{state.error}</AlertDescription>
              </Alert>
            </div>
          )}

          {!showSkeleton && state.analysis && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <PrimaryPathCard path={state.analysis.primaryPath} />
              {state.languageFamilies && <LanguageFamiliesCard families={state.languageFamilies} />}
              {state.analysis.frontierPaths.length > 0 && <FrontierPathsTable paths={state.analysis.frontierPaths} />}
            </div>
          )}

          {!showSkeleton && !state.analysis && !state.error && (
             <div className="text-center mt-12 text-muted-foreground">
                <Card className="max-w-md mx-auto p-6 inline-block">
                    <Lightbulb className="h-8 w-8 mx-auto text-accent" />
                    <h3 className="mt-4 text-lg font-semibold font-headline text-foreground">Ready to Explore</h3>
                    <p className="mt-2 text-sm">
                        Your analysis results will appear here.
                    </p>
                </Card>
             </div>
          )}
        </div>
      </main>
    </div>
  );
}
