import CardDivulgation from '../cards/card-divulgation';

export default function DashboardFeatureHighlights() {
  return (
    <div className="flex flex-col sm:flex-row w-full gap-24 sm:gap-8 my-12">
      <div className="flex justify-center sm:w-1/3">
        <CardDivulgation
          feature={'Random Questions'}
          image={'/thumbnail/tn-random-questions.webp'}
          title={'Surprise Yourself!'}
          copy={
            'Break the routine with unexpected questions to spark thought and conversation. Perfect for reflection or fun interactions!'
          }
          cta={'Get a Random Question'}
          url={'random-question'}
        />
      </div>

      <div className="flex justify-center sm:w-1/3">
        <CardDivulgation
          feature={'Decision Helper'}
          image={'/thumbnail/tn-decision-helper.webp'}
          title={'Decisions Made Fun!'}
          copy={
            'Let fate decide! Perfect for quick choices, big or small. Spin the wheel and see where it lands.'
          }
          cta={'Spin to Decide'}
          url={'decision-helper'}
        />
      </div>

      <div className="flex justify-center sm:w-1/3">
        <CardDivulgation
          feature={'Stoic Support'}
          image={'/thumbnail/tn-stoic-support.webp'}
          title={'Find Calm in the Chaos'}
          copy={
            'Life’s challenges meet ancient wisdom. Discover tailored Stoic insights to help you tackle everyday issues with resilience.'
          }
          cta={'Show me Stoic Insights'}
          url={'stoic-support'}
        />
      </div>
    </div>
  );
}
